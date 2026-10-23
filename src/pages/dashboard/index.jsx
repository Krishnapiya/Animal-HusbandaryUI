import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PetsIcon from "@mui/icons-material/Pets";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReportIcon from "@mui/icons-material/Report";
import StorefrontIcon from "@mui/icons-material/Storefront";

import { getItemList } from "../../api-client/apiCall";
import { useAuthz } from "../../context/AuthzContext";
import { getUserAttributes } from "../../utils";
import {
  CITIZEN_COMPLAINT_LIST_URL,
  DOG_BREEDER_APPLICATION_CVO_LIST_URL,
  DOG_BREEDER_APPLICATION_LIST_URL,
  DOG_BREEDER_MY_APPLICATION_LIST_URL,
  PET_SHOP_FORWARDED_APPLICATION_LIST_URL,
  PET_SHOP_MY_APPLICATION_LIST_URL,
  PET_SHOP_REGISTRATION_APPLICATION_LIST_URL,
} from "../../config/endpoints";
import {
  CITIZEN_COMPLAINT_APPLICATION_PATH,
  CITIZEN_COMPLAINT_FORWARDED_PATH,
  CITIZEN_COMPLAINT_REGISTRATION_PATH,
  DOG_BREEDER_APPLICATION_PATH,
  DOG_BREEDER_MY_APPLICATION_PATH,
  PET_SHOP_APPLICATION_PATH,
  PET_SHOP_FORWARDED_APPLICATION_PATH,
  PET_SHOP_MY_APPLICATION_PATH,
} from "../../config/routes";

const PAGE_SIZE = 200;

const SITE = {
  cream: "#f7f3ec",
  teal: "#0c3c4c",
  green: "#1f7a3a",
  ink: "#1c2b24",
  muted: "#5c6b63",
  line: "#e4ddd2",
  white: "#ffffff",
};

const STATUS_COLORS = {
  submitted: "#0c3c4c",
  withOfficer: "#1f7a3a",
  inspection: "#b45309",
  report: "#0f766e",
  approval: "#1d4ed8",
  approved: "#15803d",
  rejected: "#b91c1c",
};

const MODULE_COLORS = {
  citizen: "#0c3c4c",
  "dog-breeder": "#1f7a3a",
  "pet-shop": "#9a3412",
};

const STATUS_GROUPS = [
  {
    key: "submitted",
    label: "Submitted",
    codes: ["DRAFT", "PAYMENT_PENDING", "SUBMITTED", "RESUBMITTED"],
  },
  {
    key: "withOfficer",
    label: "With district officer",
    codes: ["FORWARDED_TO_CVO", "UNDER_REVIEW"],
  },
  {
    key: "inspection",
    label: "Inspection scheduled",
    codes: ["INSPECTION_SCHEDULED", "INVESTIGATION_SCHEDULED"],
  },
  {
    key: "report",
    label: "Report uploaded",
    codes: ["ACTION_TAKEN"],
  },
  {
    key: "approval",
    label: "Awaiting approval",
    codes: ["VERIFIED_BY_CVO"],
  },
  {
    key: "approved",
    label: "Approved",
    codes: ["APPLICATION_APPROVED", "APPROVED"],
  },
  {
    key: "rejected",
    label: "Rejected",
    codes: ["APPLICATION_REJECTED", "REJECTED_BY_CVO", "REJECTED"],
  },
];

const roleNames = () => {
  const user = getUserAttributes();
  const values = [
    user?.role,
    user?.roleName,
    user?.role?.roleName,
    user?.role?.name,
    user?.role?.authority,
  ];

  if (Array.isArray(user?.roles)) {
    values.push(...user.roles);
  }

  return values
    .map((role) => {
      const name =
        typeof role === "string"
          ? role
          : role?.roleName || role?.name || role?.authority || "";

      return String(name).trim().toUpperCase().replace(/^ROLE_/, "");
    })
    .filter(Boolean);
};

const statusCode = (row) => {
  const status = row?.status ?? row?.applicationStatus ?? row?.statusName;
  const raw =
    typeof status === "object"
      ? status.statusCode || status.name || status.statusName || status.label
      : status;

  return String(raw || "UNKNOWN")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};

const statusLabel = (row) => {
  const status = row?.status ?? row?.applicationStatus;
  if (status && typeof status === "object") {
    return status.name || status.statusName || status.statusCode || "-";
  }

  return status || "-";
};

const recordTitle = (row) =>
  row?.complaintNumber ||
  row?.applicationNumber ||
  row?.registrationNumber ||
  `Record ${row?.id || ""}`;

const extractRows = (response) => {
  const payload =
    response?.data?.payLoad ?? response?.data?.payload ?? response?.data ?? [];

  if (Array.isArray(payload)) {
    return { rows: payload, total: payload.length };
  }

  const rows = Array.isArray(payload?.content) ? payload.content : [];
  const total = Number(payload?.totalRecords ?? payload?.totalElements ?? rows.length);

  return { rows, total: Number.isFinite(total) ? total : rows.length };
};

const countGroups = (rows) => {
  const counts = Object.fromEntries(STATUS_GROUPS.map((group) => [group.key, 0]));
  let other = 0;

  rows.forEach((row) => {
    const code = statusCode(row);
    const group = STATUS_GROUPS.find((item) => item.codes.includes(code));

    if (group) {
      counts[group.key] += 1;
    } else {
      other += 1;
    }
  });

  return { counts, other };
};

const attentionCodes = (kind) => {
  if (kind === "admin") {
    return ["SUBMITTED", "RESUBMITTED", "VERIFIED_BY_CVO"];
  }

  if (kind === "officer") {
    return [
      "FORWARDED_TO_CVO",
      "UNDER_REVIEW",
      "INSPECTION_SCHEDULED",
      "INVESTIGATION_SCHEDULED",
      "ACTION_TAKEN",
    ];
  }

  return ["DRAFT", "PAYMENT_PENDING", "SUBMITTED", "RESUBMITTED"];
};

const attentionText = (code, kind) => {
  if (kind === "admin" && ["SUBMITTED", "RESUBMITTED"].includes(code)) {
    return "Forward to district officer";
  }

  if (kind === "admin" && code === "VERIFIED_BY_CVO") {
    return "Approve report";
  }

  if (kind === "officer" && ["FORWARDED_TO_CVO", "UNDER_REVIEW"].includes(code)) {
    return "Schedule inspection";
  }

  if (
    kind === "officer" &&
    ["INSPECTION_SCHEDULED", "INVESTIGATION_SCHEDULED"].includes(code)
  ) {
    return "Upload investigation report";
  }

  if (kind === "officer" && code === "ACTION_TAKEN") {
    return "Send report to admin";
  }

  if (kind === "applicant" && code === "DRAFT") {
    return "Complete and submit";
  }

  return "Waiting for the next step";
};

const firstAllowedPath = (can, paths) =>
  paths.find((path) => can(path, "list")) || paths[0];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { can, apiNavModules } = useAuthz();
  const user = getUserAttributes();
  const roles = roleNames();
  const isAdmin = roles.includes("ADMIN");
  const isOfficer =
    roles.includes("DISTRICT_OFFICER") || roles.includes("CVO");
  const kind = isAdmin ? "admin" : isOfficer ? "officer" : "applicant";
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const sources = useMemo(() => [
    {
      id: "citizen",
      title: "Citizen complaints",
      icon: ReportIcon,
      summary: isOfficer
        ? "Complaints forwarded for inspection and investigation."
        : "Complaints from filing through admin approval.",
      paths: [
        CITIZEN_COMPLAINT_APPLICATION_PATH,
        CITIZEN_COMPLAINT_FORWARDED_PATH,
        CITIZEN_COMPLAINT_REGISTRATION_PATH,
      ],
      url: CITIZEN_COMPLAINT_LIST_URL,
    },
    {
      id: "dog-breeder",
      title: "Dog breeder",
      icon: PetsIcon,
      summary: isOfficer
        ? "Dog breeder applications in your district."
        : isAdmin
          ? "Dog breeder applications across districts."
          : "Your dog breeder applications.",
      paths: [DOG_BREEDER_APPLICATION_PATH, DOG_BREEDER_MY_APPLICATION_PATH],
      url: isOfficer
        ? DOG_BREEDER_APPLICATION_CVO_LIST_URL
        : isAdmin
          ? DOG_BREEDER_APPLICATION_LIST_URL
          : DOG_BREEDER_MY_APPLICATION_LIST_URL,
    },
    {
      id: "pet-shop",
      title: "Pet shop",
      icon: StorefrontIcon,
      summary: isOfficer
        ? "Pet shop applications forwarded to your district."
        : isAdmin
          ? "Pet shop applications across districts."
          : "Your pet shop applications.",
      paths: [
        PET_SHOP_APPLICATION_PATH,
        PET_SHOP_FORWARDED_APPLICATION_PATH,
        PET_SHOP_MY_APPLICATION_PATH,
      ],
      url: isOfficer
        ? PET_SHOP_FORWARDED_APPLICATION_LIST_URL
        : isAdmin
          ? `${PET_SHOP_REGISTRATION_APPLICATION_LIST_URL}list/all`
          : PET_SHOP_MY_APPLICATION_LIST_URL,
    },
  ].filter((source) => source.paths.some((path) => can(path, "list"))), [
    can,
    isAdmin,
    isOfficer,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadBoards = async () => {
      setLoading(true);

      const loaded = await Promise.all(
        sources.map(async (source) => {
          const response = await getItemList(source.url, {
            pageNo: 0,
            pageSize: PAGE_SIZE,
          });

          if (!response?.isSuccess) {
            return {
              ...source,
              error:
                response?.data?.resultString ||
                response?.data?.detail ||
                "Could not load this module",
              rows: [],
              total: 0,
              counts: {},
              other: 0,
            };
          }

          const { rows, total } = extractRows(response);
          const { counts, other } = countGroups(rows);

          return {
            ...source,
            error: "",
            rows,
            total,
            counts,
            other,
            openPath: firstAllowedPath(can, source.paths),
          };
        })
      );

      if (!cancelled) {
        setBoards(loaded);
        setLoading(false);
      }
    };

    loadBoards();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, can, sources]);

  const actionable = boards.flatMap((board) =>
    (board.rows || [])
      .filter((row) => attentionCodes(kind).includes(statusCode(row)))
      .map((row) => ({
        id: `${board.id}-${row.id}`,
        title: recordTitle(row),
        module: board.title,
        action: attentionText(statusCode(row), kind),
        status: statusLabel(row),
        path: board.openPath,
      }))
  );

  const operationalPaths = new Set(sources.flatMap((source) => source.paths));
  const otherModules = (apiNavModules || [])
    .map((module) => ({
      title: module.title || module.name || "Module",
      children: (module.children || []).filter((child) => {
        const path = String(child.path || child.slug || child.segment || "")
          .trim()
          .toLowerCase();
        return path && !operationalPaths.has(path);
      }),
    }))
    .filter((module) => module.children.length > 0);

  const displayName = [user?.fname, user?.lname].filter(Boolean).join(" ");
  const totalRecords = boards.reduce((sum, board) => sum + (board.total || 0), 0);
  const approvedCount = boards.reduce(
    (sum, board) => sum + (board.counts?.approved || 0),
    0
  );
  const roleHint = isAdmin
    ? "Forward new cases and approve reports sent by district officers."
    : isOfficer
      ? "Schedule inspections, upload reports, and send them to admin."
      : "Track the applications and complaints linked to your login.";

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif" }}>
      <Box
        sx={{
          bgcolor: SITE.cream,
          border: `1px solid ${SITE.line}`,
          borderRadius: 2,
          p: { xs: 2, md: 3 },
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: SITE.green,
              fontWeight: 800,
              letterSpacing: 0.4,
              fontSize: { xs: 22, md: 28 },
              lineHeight: 1.15,
              textTransform: "uppercase",
            }}
          >
            {displayName ? `Welcome, ${displayName}` : "Dashboard"}
          </Typography>
          <Typography sx={{ color: SITE.muted, mt: 0.75, maxWidth: 640 }}>
            {roleHint}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => setReloadKey((value) => value + 1)}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            bgcolor: SITE.teal,
            boxShadow: "none",
            "&:hover": { bgcolor: "#082f3b", boxShadow: "none" },
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "Needs your action", value: loading ? "—" : actionable.length, color: "#b45309" },
          { label: "Records in view", value: loading ? "—" : totalRecords, color: SITE.teal },
          { label: "Approved", value: loading ? "—" : approvedCount, color: SITE.green },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${SITE.line}`,
                borderRadius: 2,
                borderTop: `4px solid ${item.color}`,
              }}
            >
              <Typography sx={{ color: SITE.muted, fontSize: 13 }}>{item.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 32, color: SITE.ink, lineHeight: 1.2 }}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{ p: { xs: 2, md: 2.5 }, mb: 2, border: `1px solid ${SITE.line}`, borderRadius: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AssignmentIcon sx={{ color: SITE.teal }} />
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: SITE.teal }}>
            Needs your action
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress sx={{ color: SITE.teal }} />
          </Box>
        ) : actionable.length === 0 ? (
          <Box
            sx={{
              bgcolor: "#f3faf5",
              borderRadius: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: SITE.green }} />
            <Typography sx={{ color: SITE.ink }}>
              Nothing is waiting for you right now.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {actionable.slice(0, 6).map((item) => (
              <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(`/${item.path}`)}
                  sx={{
                    border: `1px solid ${SITE.line}`,
                    borderRadius: 2,
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.75,
                    cursor: "pointer",
                    "&:hover": { borderColor: SITE.teal, bgcolor: SITE.cream },
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: SITE.ink }}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: SITE.muted }}>
                    {item.module} · {item.status}
                  </Typography>
                  <Typography variant="body2" sx={{ color: SITE.teal, fontWeight: 700 }}>
                    {item.action}
                  </Typography>
                  <Box sx={{ mt: "auto", pt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/${item.path}`);
                      }}
                      sx={{ textTransform: "none", color: SITE.green, fontWeight: 700 }}
                    >
                      Open
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Grid container spacing={2}>
        {sources.map((source) => {
          const board = boards.find((item) => item.id === source.id);
          const Icon = source.icon;
          const total = board?.total || 0;
          const accent = MODULE_COLORS[source.id] || SITE.teal;

          return (
            <Grid key={source.id} size={{ xs: 12, lg: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: "100%",
                  border: `1px solid ${SITE.line}`,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      border: "5px solid #e7d7c3",
                      bgcolor: SITE.white,
                      color: accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: SITE.ink }}>{source.title}</Typography>
                    <Typography variant="body2" sx={{ color: SITE.muted }}>
                      {source.summary}
                    </Typography>
                  </Box>
                </Box>

                {!board || loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                    <CircularProgress size={28} sx={{ color: SITE.teal }} />
                  </Box>
                ) : board.error ? (
                  <Alert severity="error">{board.error}</Alert>
                ) : (
                  <>
                    <Typography sx={{ fontWeight: 800, mb: 1, color: SITE.ink }}>
                      {total} record{total === 1 ? "" : "s"}
                    </Typography>
                    {board.rows.length < total && (
                      <Typography variant="caption" sx={{ color: SITE.muted, display: "block", mb: 1 }}>
                        Status counts use the latest {board.rows.length} records.
                      </Typography>
                    )}
                    {STATUS_GROUPS.map((group) => {
                      const count = board.counts[group.key] || 0;
                      const width =
                        board.rows.length > 0
                          ? `${(count / board.rows.length) * 100}%`
                          : "0%";

                      return (
                        <Box key={group.key} sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.4,
                            }}
                          >
                            <Typography variant="body2" sx={{ color: SITE.ink }}>
                              {group.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                              {count}
                            </Typography>
                          </Box>
                          <Box sx={{ height: 8, bgcolor: "#efe8dc", borderRadius: 99 }}>
                            <Box
                              sx={{
                                height: 8,
                                width,
                                borderRadius: 99,
                                bgcolor: STATUS_COLORS[group.key],
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                    {board.other > 0 && (
                      <Typography variant="body2" sx={{ color: SITE.muted }}>
                        Other statuses: {board.other}
                      </Typography>
                    )}
                    {total === 0 && (
                      <Typography sx={{ color: SITE.muted, mt: 1 }}>
                        No records yet.
                      </Typography>
                    )}
                  </>
                )}

                <Button
                  variant="outlined"
                  sx={{
                    mt: "auto",
                    pt: 1,
                    textTransform: "none",
                    borderRadius: 999,
                    borderColor: SITE.green,
                    color: SITE.green,
                    fontWeight: 700,
                    "&:hover": { borderColor: "#166030", bgcolor: "#f3faf5" },
                  }}
                  startIcon={<OpenInNewIcon />}
                  onClick={() =>
                    navigate(
                      `/${board?.openPath || firstAllowedPath(can, source.paths)}`
                    )
                  }
                >
                  Open {source.title}
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {otherModules.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ mb: 1, fontWeight: 800, color: SITE.teal }}>
            Other modules
          </Typography>
          <Grid container spacing={2}>
            {otherModules.map((module) => (
              <Grid key={module.title} size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, border: `1px solid ${SITE.line}`, borderRadius: 2 }}
                >
                  <Typography sx={{ fontWeight: 800, mb: 1, color: SITE.ink }}>
                    {module.title}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {module.children.map((child) => {
                      const path = String(
                        child.path || child.slug || child.segment || ""
                      ).trim();
                      const title = child.title || child.name || path;

                      return (
                        <Button
                          key={path}
                          variant="outlined"
                          size="small"
                          startIcon={<OpenInNewIcon />}
                          onClick={() => navigate(`/${path}`)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 999,
                            borderColor: SITE.line,
                            color: SITE.teal,
                          }}
                        >
                          {title}
                        </Button>
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {!loading && sources.length === 0 && otherModules.length === 0 && (
        <Alert severity="info" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
          No modules are assigned to this login yet.
        </Alert>
      )}
    </Box>
  );
};

export default DashboardPage;
