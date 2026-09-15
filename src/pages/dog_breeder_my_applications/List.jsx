import PropTypes from "prop-types";
import { useMemo, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import { toast } from "material-react-toastify";

import {
  resubmitDogBreederApplication,
  getDogBreederApplicationHistory,
} from "../../api-client/adminDogBreederApplication";

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

/* =========================================================
   GET APPLICATION ID
========================================================= */

const getApplicationId = (row) => {
  const id =
    row?.id ??
    row?.applicationId ??
    row?.registrationApplicationId ??
    row?.registration_application_id ??
    row?.registrationDetails?.id ??
    row?.registrationDetails?.applicationId;

  return id !== null && id !== undefined ? String(id) : null;
};

/* =========================================================
   GET ROW STATUS
========================================================= */

const getRowStatus = (row) => {
  if (!row) return "";

  const possibleStatuses = [
    row?.statusCode,
    row?.statusName,
    row?.applicationStatusCode,
    row?.applicationStatusName,
    row?.registrationStatusCode,
    row?.registrationStatusName,
    row?.status?.statusCode,
    row?.status?.code,
    row?.status?.name,
    row?.status?.statusName,
    row?.applicationStatus?.statusCode,
    row?.applicationStatus?.code,
    row?.applicationStatus?.name,
    row?.applicationStatus?.statusName,
    row?.registrationDetails?.statusCode,
    row?.registrationDetails?.statusName,
    row?.registrationDetails?.applicationStatusCode,
    row?.registrationDetails?.applicationStatusName,
    row?.registrationDetails?.status?.statusCode,
    row?.registrationDetails?.status?.code,
    row?.registrationDetails?.status?.name,
    row?.registrationDetails?.status?.statusName,
  ];

  for (const value of possibleStatuses) {
    if (value !== null && value !== undefined && typeof value !== "object") {
      const status = normalizeStatus(value);
      if (status) return status;
    }
  }

  return "";
};

/* =========================================================
   CHECK REJECTED BY CVO
========================================================= */

const isRejectedByCvo = (row) => {
  if (!row) return false;
  const status = getRowStatus(row);
  return (
    status === "REJECTED_BY_CVO" ||
    status === "REJECTEDBYCVO" ||
    status.includes("REJECTED_BY_CVO")
  );
};

/* =========================================================
   CHECK APPLICATION REJECTED
========================================================= */

const isApplicationRejected = (row) => {
  if (!row) return false;
  return getRowStatus(row) === "APPLICATION_REJECTED";
};

/* =========================================================
   CHECK APPROVED
========================================================= */

const isApplicationApproved = (row) => {
  if (!row) return false;
  const status = getRowStatus(row);
  return status === "APPLICATION_APPROVED" || status === "APPROVED";
};

/* =========================================================
   STATUS LABEL
========================================================= */

const getStatusLabel = (status) => {
  switch (normalizeStatus(status)) {
    case "SUBMITTED":
      return "Submitted";
    case "RESUBMITTED":
      return "Resubmitted";
    case "APPLICATION_APPROVED":
    case "APPROVED":
      return "Approved";
    case "REJECTED_BY_CVO":
      return "Rejected by CVO";
    case "APPLICATION_REJECTED":
      return "Application Rejected";
    case "DRAFT":
      return "Draft";
    case "FORWARDED_TO_CVO":
      return "Forwarded to CVO";
    case "INSPECTION_SCHEDULED":
      return "Inspection Scheduled";
    case "VERIFIED_BY_CVO":
      return "Verified by CVO";
    default:
      return status || "-";
  }
};

/* =========================================================
   STATUS CHIP COLOR
========================================================= */

const getStatusChipColor = (status) => {
  switch (normalizeStatus(status)) {
    case "APPLICATION_APPROVED":
    case "APPROVED":
      return "success";
    case "REJECTED_BY_CVO":
    case "APPLICATION_REJECTED":
      return "error";
    case "RESUBMITTED":
      return "info";
    case "SUBMITTED":
      return "primary";
    case "FORWARDED_TO_CVO":
      return "warning";
    default:
      return "default";
  }
};

/* =========================================================
   STATUS TABS
========================================================= */

const BREEDER_STATUS_TABS = [
  { value: "ALL", label: "ALL" },
  { value: "SUBMITTED", label: "SUBMITTED" },
  { value: "RESUBMITTED", label: "RESUBMITTED" },
  { value: "REJECTED", label: "REJECTED" },
  { value: "APPLICATION_APPROVED", label: "APPROVED" },
];

/* =========================================================
   LOCAL FALLBACK HISTORY FROM ROW
========================================================= */

const getApplicationHistory = (row) => {
  if (!row) return [];

  const possibleHistory = [
    row?.history,
    row?.applicationHistory,
    row?.resubmissionHistory,
    row?.statusHistory,
    row?.applicationStatusHistory,
    row?.registrationHistory,
    row?.registrationDetails?.history,
    row?.registrationDetails?.applicationHistory,
    row?.registrationDetails?.statusHistory,
  ];

  for (const history of possibleHistory) {
    if (Array.isArray(history)) return history;
  }

  return [];
};

/* =========================================================
   HISTORY ITEM HELPERS
========================================================= */

const getHistoryDate = (item) => {
  const rawDate =
    item?.changedAt ??
    item?.createdAt ??
    item?.updatedAt ??
    item?.createdDate ??
    item?.updatedDate ??
    item?.date ??
    item?.actionDate ??
    item?.statusDate ??
    item?.timestamp;

  if (!rawDate) return "-";

  const dateObj = typeof rawDate === "number" ? new Date(rawDate) : new Date(String(rawDate));
  return isNaN(dateObj.getTime()) ? "-" : dateObj.toLocaleString();
};

const getHistoryStatus = (item) => {
  const status =
    item?.toStatus ??
    item?.actionType ??
    item?.statusCode ??
    item?.statusName ??
    item?.status ??
    item?.applicationStatusCode ??
    item?.applicationStatusName ??
    item?.applicationStatus ??
    item?.action ??
    "";

  return normalizeStatus(typeof status === "object" ? status?.name : status);
};

const getHistoryRemarks = (item) => {
  return (
    item?.remarks ??
    item?.remark ??
    item?.comments ??
    item?.comment ??
    item?.reason ??
    item?.description ??
    "-"
  );
};

const getHistoryUser = (item) => {
  return (
    item?.changedBy ??
    item?.createdBy ??
    item?.updatedByName ??
    item?.createdByName ??
    item?.userName ??
    item?.username ??
    item?.updatedBy ??
    item?.user?.name ??
    item?.user?.username ??
    item?.role ??
    "-"
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const List = (props) => {
  const tableColumns = props.tableColumns || [];
  const rows = props.rows || [];

  const [openResubmitModal, setOpenResubmitModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [historyRow, setHistoryRow] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [selectedStatusTab, setSelectedStatusTab] = useState("ALL");

  const filteredRows = useMemo(() => {
    if (selectedStatusTab === "ALL") return rows;

    return rows.filter((row) => {
      const status = getRowStatus(row);
      if (selectedStatusTab === "SUBMITTED") return status === "SUBMITTED";
      if (selectedStatusTab === "RESUBMITTED") return status === "RESUBMITTED";
      if (selectedStatusTab === "REJECTED") {
        return (
          status === "REJECTED_BY_CVO" ||
          status === "REJECTEDBYCVO" ||
          status.includes("REJECTED_BY_CVO") ||
          status === "APPLICATION_REJECTED"
        );
      }
      if (selectedStatusTab === "APPLICATION_APPROVED") {
        return status === "APPLICATION_APPROVED" || status === "APPROVED";
      }
      return false;
    });
  }, [rows, selectedStatusTab]);

  const statusCounts = useMemo(() => {
    const counts = { ALL: rows.length, SUBMITTED: 0, RESUBMITTED: 0, REJECTED: 0, APPLICATION_APPROVED: 0 };
    rows.forEach((row) => {
      const status = getRowStatus(row);
      if (status === "SUBMITTED") counts.SUBMITTED += 1;
      if (status === "RESUBMITTED") counts.RESUBMITTED += 1;
      if (
        status === "REJECTED_BY_CVO" ||
        status === "REJECTEDBYCVO" ||
        status.includes("REJECTED_BY_CVO") ||
        status === "APPLICATION_REJECTED"
      ) {
        counts.REJECTED += 1;
      }
      if (status === "APPLICATION_APPROVED" || status === "APPROVED") counts.APPLICATION_APPROVED += 1;
    });
    return counts;
  }, [rows]);

  const handleStatusTabChange = (event, newValue) => {
    setSelectedStatusTab(newValue);
  };

  const handleOpenModal = (row) => {
    if (!isRejectedByCvo(row)) {
      toast.info("Only applications rejected by CVO can be resubmitted.");
      return;
    }

    setSelectedRow(row);
    setRemarks("");
    setFile(null);
    setOpenResubmitModal(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setOpenResubmitModal(false);
    setSelectedRow(null);
    setRemarks("");
    setFile(null);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmitResubmit = async () => {
    const applicationId = getApplicationId(selectedRow);

    if (!applicationId) {
      toast.error("Application ID is missing.");
      return;
    }

    if (!isRejectedByCvo(selectedRow)) {
      toast.error("This application is not eligible for resubmission.");
      return;
    }

    if (!remarks.trim()) {
      toast.error("Please enter remarks.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("applicationId", applicationId);
      formData.append("remarks", remarks.trim());

      if (file) {
        formData.append("file", file);
      }

      await resubmitDogBreederApplication(formData);

      toast.success("Application resubmitted successfully.");

      handleCloseModal();

      if (typeof props.handleRefreshTable === "function") {
        await props.handleRefreshTable();
      }
    } catch (error) {
      console.error("Resubmit application error:", error);
      const message =
        error?.response?.data?.resultString ||
        error?.response?.data?.message ||
        error?.response?.data?.result?.message ||
        error?.message ||
        "Failed to resubmit application.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenHistory = async (row) => {
    const applicationId = getApplicationId(row);

    setHistoryRow(row);
    setOpenHistoryModal(true);
    setIsHistoryLoading(true);

    if (!applicationId) {
      setHistoryList(getApplicationHistory(row));
      setIsHistoryLoading(false);
      return;
    }

    try {
      const response = await getDogBreederApplicationHistory(applicationId);

      const fetchedHistory = Array.isArray(response)
        ? response
        : response?.data || response?.result || response?.history || [];

      setHistoryList(fetchedHistory.length > 0 ? fetchedHistory : getApplicationHistory(row));
    } catch (error) {
      console.error("Fetch application history error:", error);
      toast.error("Failed to load history from server.");
      setHistoryList(getApplicationHistory(row));
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleCloseHistory = () => {
    setOpenHistoryModal(false);
    setHistoryRow(null);
    setHistoryList([]);
  };

  const tableColumnCount = tableColumns.length + 3;

  const selectedStatusLabel =
    BREEDER_STATUS_TABS.find((tab) => tab.value === selectedStatusTab)?.label || "ALL";

  const historyApplicationId = getApplicationId(historyRow) || "-";
  const historyApplicationNumber =
    historyRow?.applicationNumber || historyRow?.registrationDetails?.applicationNumber || "-";
  const historyBreederName =
    historyRow?.breederName ||
    historyRow?.breederDetails?.breederName ||
    historyRow?.breederDetails?.name ||
    historyRow?.dogBreederDetail?.breederName ||
    "-";

  const historyStatus = getRowStatus(historyRow);

  return (
    <>
      {/* TABS HEADER */}
      <Box sx={{ width: "100%", borderBottom: "1px solid #ddd", mb: 2 }}>
        <Tabs
          value={selectedStatusTab}
          onChange={handleStatusTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.85rem",
            },
            "& .Mui-selected": {
              fontWeight: 700,
            },
          }}
        >
          {BREEDER_STATUS_TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{tab.label}</span>
                  <Badge
                    badgeContent={statusCounts[tab.value] || 0}
                    color="primary"
                    max={999}
                    sx={{
                      "& .MuiBadge-badge": {
                        position: "relative",
                        transform: "none",
                        top: "auto",
                        right: "auto",
                        minWidth: 20,
                        height: 20,
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                      },
                    }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* MAIN DATA TABLE */}
      <Table stickyHeader sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            {tableColumns.map((col, index) => (
              <TableCell key={col.attr || index}>
                <TableSortLabel
                  onClick={() => {
                    if (typeof props.handleSortClick === "function") {
                      props.handleSortClick(col.attr);
                    }
                  }}
                  active={col.attr === props.sortAttributeDirection?.attr}
                  direction={
                    col.attr === props.sortAttributeDirection?.attr
                      ? props.sortAttributeDirection?.direction || "asc"
                      : "asc"
                  }
                >
                  {col.header}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="center">View</TableCell>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">History</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRows.map((row, index) => {
            const applicationId = getApplicationId(row);
            const status = getRowStatus(row);
            const rejectedByCvo = isRejectedByCvo(row);
            const applicationRejected = isApplicationRejected(row);
            const approved = isApplicationApproved(row);

            return (
              <TableRow key={applicationId || index}>
                {tableColumns.map((col, colIndex) => (
                  <TableCell key={col.attr || colIndex}>
                    {col.attr === "status" ? (
                      <Chip
                        size="small"
                        label={getStatusLabel(status)}
                        color={getStatusChipColor(status)}
                      />
                    ) : typeof col.render === "function" ? (
                      col.render(row)
                    ) : (
                      String(row[col.attr] ?? "")
                    )}
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Tooltip title="View Application">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        if (typeof props.handleEditClick === "function") {
                          props.handleEditClick(applicationId, row);
                        }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  {rejectedByCvo ? (
                    <Button
                      variant="contained"
                      size="small"
                      color="warning"
                      startIcon={<ReplayIcon />}
                      onClick={() => handleOpenModal(row)}
                    >
                      RESUBMIT
                    </Button>
                  ) : applicationRejected ? (
                    <Button
                      variant="contained"
                      size="small"
                      disabled
                      sx={{
                        "&.Mui-disabled": {
                          backgroundColor: "#ffebee",
                          color: "#d32f2f",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      REJECTED
                    </Button>
                  ) : approved ? (
                    <Button
                      variant="contained"
                      size="small"
                      disabled
                      sx={{
                        "&.Mui-disabled": {
                          backgroundColor: "#e8f5e9",
                          color: "#2e7d32",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      APPROVED
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="View Application History">
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenHistory(row)}
                    >
                      <HistoryIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}

          {filteredRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={tableColumnCount} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  No applications found for {selectedStatusLabel}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* RESUBMIT DIALOG */}
      <Dialog open={openResubmitModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle align="center" sx={{ fontWeight: 600 }}>
          Resubmit Application
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Application Number
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {selectedRow?.applicationNumber ||
                  selectedRow?.registrationDetails?.applicationNumber ||
                  "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Breeder Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {selectedRow?.breederName ||
                  selectedRow?.breederDetails?.breederName ||
                  selectedRow?.breederDetails?.name ||
                  selectedRow?.dogBreederDetail?.breederName ||
                  "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Current Status
              </Typography>
              <Typography variant="body1" fontWeight={600} color="error.main">
                {getStatusLabel(getRowStatus(selectedRow))}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              required
              label="Remarks"
              placeholder="Enter remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Supporting Documents
              </Typography>

              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={isSubmitting}
              >
                Upload Documents
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {file.name}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseModal} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitResubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TABLE-BASED HISTORY DIALOG */}
      <Dialog open={openHistoryModal} onClose={handleCloseHistory} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
          }}
        >
          <HistoryIcon color="primary" />
          Application History
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Application Number
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {historyApplicationNumber}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Breeder Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {historyBreederName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Current Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={getStatusLabel(historyStatus)}
                    color={getStatusChipColor(historyStatus)}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Application ID
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {historyApplicationId}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 2 }}>
                Status History
              </Typography>

              {isHistoryLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : historyList && historyList.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Remarks / Reason</TableCell>
                      <TableCell>Updated By</TableCell>
                      <TableCell>Date &amp; Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyList
                      .slice()
                      .reverse()
                      .map((item, index) => {
                        const itemStatus = getHistoryStatus(item);
                        return (
                          <TableRow key={item?.id || index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={
                                  getStatusLabel(itemStatus) !== "-"
                                    ? getStatusLabel(itemStatus)
                                    : item?.actionType || "Updated"
                                }
                                color={getStatusChipColor(itemStatus)}
                              />
                            </TableCell>
                            <TableCell>{getHistoryRemarks(item)}</TableCell>
                            <TableCell>{getHistoryUser(item)}</TableCell>
                            <TableCell>{getHistoryDate(item)}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    gap: 1,
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                  <Typography variant="body2" color="text.secondary">
                    No history available for this application.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseHistory} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

List.propTypes = {
  tableColumns: PropTypes.array,
  rows: PropTypes.array,
  handleSortClick: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
  handleEditClick: PropTypes.func,
  handleRefreshTable: PropTypes.func,
};

export default List;