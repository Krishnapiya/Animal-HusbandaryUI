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

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import { toast } from "material-react-toastify";

import {
  resubmitDogBreederApplication,
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

  return id !== null && id !== undefined
    ? String(id)
    : null;
};

/* =========================================================
   GET ROW STATUS
========================================================= */

const getRowStatus = (row) => {
  if (!row) {
    return "";
  }

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
    if (
      value !== null &&
      value !== undefined &&
      typeof value !== "object"
    ) {
      const status = normalizeStatus(value);

      if (status) {
        return status;
      }
    }
  }

  return "";
};

/* =========================================================
   CHECK REJECTED BY CVO
========================================================= */

const isRejectedByCvo = (row) => {
  if (!row) {
    return false;
  }

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
  if (!row) {
    return false;
  }

  const status = getRowStatus(row);

  return status === "APPLICATION_REJECTED";
};

/* =========================================================
   CHECK APPROVED
========================================================= */

const isApplicationApproved = (row) => {
  if (!row) {
    return false;
  }

  const status = getRowStatus(row);

  return (
    status === "APPLICATION_APPROVED" ||
    status === "APPROVED"
  );
};

/* =========================================================
   STATUS LABEL
========================================================= */

const getStatusLabel = (status) => {
  switch (status) {
    case "SUBMITTED":
      return "Submitted";

    case "RESUBMITTED":
      return "Resubmitted";

    case "APPLICATION_APPROVED":
      return "Application Approved";

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
  {
    value: "ALL",
    label: "ALL",
  },
  {
    value: "SUBMITTED",
    label: "SUBMITTED",
  },
  {
    value: "RESUBMITTED",
    label: "RESUBMITTED",
  },
  {
    value: "REJECTED",
    label: "REJECTED",
  },
  {
    value: "APPLICATION_APPROVED",
    label: "APPROVED",
  },
];

/* =========================================================
   GET HISTORY FROM ROW
========================================================= */

const getApplicationHistory = (row) => {
  if (!row) {
    return [];
  }

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
    if (Array.isArray(history)) {
      return history;
    }
  }

  return [];
};

/* =========================================================
   GET HISTORY DATE
========================================================= */

const getHistoryDate = (item) => {
  return (
    item?.createdAt ??
    item?.updatedAt ??
    item?.createdDate ??
    item?.updatedDate ??
    item?.date ??
    item?.actionDate ??
    item?.statusDate ??
    item?.timestamp ??
    "-"
  );
};

/* =========================================================
   GET HISTORY STATUS
========================================================= */

const getHistoryStatus = (item) => {
  const status =
    item?.statusCode ??
    item?.statusName ??
    item?.status ??
    item?.applicationStatusCode ??
    item?.applicationStatusName ??
    item?.applicationStatus ??
    item?.action ??
    "";

  return normalizeStatus(status);
};

/* =========================================================
   GET HISTORY REMARKS
========================================================= */

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

/* =========================================================
   GET HISTORY USER
========================================================= */

const getHistoryUser = (item) => {
  return (
    item?.updatedByName ??
    item?.createdByName ??
    item?.userName ??
    item?.username ??
    item?.updatedBy ??
    item?.createdBy ??
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

  /* =======================================================
     RESUBMIT MODAL
  ======================================================= */

  const [openResubmitModal, setOpenResubmitModal] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState(null);

  const [remarks, setRemarks] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =======================================================
     HISTORY MODAL
  ======================================================= */

  const [openHistoryModal, setOpenHistoryModal] =
    useState(false);

  const [historyRow, setHistoryRow] =
    useState(null);

  /* =======================================================
     STATUS TAB
  ======================================================= */

  const [selectedStatusTab, setSelectedStatusTab] =
    useState("ALL");

  /* =======================================================
     FILTER ROWS
  ======================================================= */

  const filteredRows = useMemo(() => {
    if (selectedStatusTab === "ALL") {
      return rows;
    }

    return rows.filter((row) => {
      const status = getRowStatus(row);

      if (selectedStatusTab === "SUBMITTED") {
        return status === "SUBMITTED";
      }

      if (selectedStatusTab === "RESUBMITTED") {
        return status === "RESUBMITTED";
      }

      if (selectedStatusTab === "REJECTED") {
        return (
          status === "REJECTED_BY_CVO" ||
          status === "REJECTEDBYCVO" ||
          status.includes("REJECTED_BY_CVO") ||
          status === "APPLICATION_REJECTED"
        );
      }

      if (
        selectedStatusTab ===
        "APPLICATION_APPROVED"
      ) {
        return (
          status === "APPLICATION_APPROVED" ||
          status === "APPROVED"
        );
      }

      return false;
    });
  }, [
    rows,
    selectedStatusTab,
  ]);

  /* =======================================================
     STATUS COUNTS
  ======================================================= */

  const statusCounts = useMemo(() => {
    const counts = {
      ALL: rows.length,
      SUBMITTED: 0,
      RESUBMITTED: 0,
      REJECTED: 0,
      APPLICATION_APPROVED: 0,
    };

    rows.forEach((row) => {
      const status = getRowStatus(row);

      if (status === "SUBMITTED") {
        counts.SUBMITTED += 1;
      }

      if (status === "RESUBMITTED") {
        counts.RESUBMITTED += 1;
      }

      if (
        status === "REJECTED_BY_CVO" ||
        status === "REJECTEDBYCVO" ||
        status.includes("REJECTED_BY_CVO") ||
        status === "APPLICATION_REJECTED"
      ) {
        counts.REJECTED += 1;
      }

      if (
        status === "APPLICATION_APPROVED" ||
        status === "APPROVED"
      ) {
        counts.APPLICATION_APPROVED += 1;
      }
    });

    return counts;
  }, [rows]);

  /* =======================================================
     TAB CHANGE
  ======================================================= */

  const handleStatusTabChange = (
    event,
    newValue
  ) => {
    setSelectedStatusTab(newValue);
  };

  /* =======================================================
     OPEN RESUBMIT MODAL
  ======================================================= */

  const handleOpenModal = (row) => {
    if (!isRejectedByCvo(row)) {
      toast.info(
        "Only applications rejected by CVO can be resubmitted."
      );
      return;
    }

    setSelectedRow(row);
    setRemarks("");
    setFile(null);
    setOpenResubmitModal(true);
  };

  /* =======================================================
     CLOSE RESUBMIT MODAL
  ======================================================= */

  const handleCloseModal = () => {
    if (isSubmitting) {
      return;
    }

    setOpenResubmitModal(false);
    setSelectedRow(null);
    setRemarks("");
    setFile(null);
  };

  /* =======================================================
     FILE SELECT
  ======================================================= */

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0] || null;

    setFile(selectedFile);
  };

  /* =======================================================
     SUBMIT RESUBMISSION
  ======================================================= */

  const handleSubmitResubmit = async () => {
    const applicationId =
      getApplicationId(selectedRow);

    if (!applicationId) {
      toast.error(
        "Application ID is missing."
      );
      return;
    }

    if (!isRejectedByCvo(selectedRow)) {
      toast.error(
        "This application is not eligible for resubmission."
      );
      return;
    }

    if (!remarks.trim()) {
      toast.error(
        "Please enter remarks."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append(
        "applicationId",
        applicationId
      );

      formData.append(
        "remarks",
        remarks.trim()
      );

      if (file) {
        formData.append(
          "file",
          file
        );
      }

      await resubmitDogBreederApplication(
        formData
      );

      toast.success(
        "Application resubmitted successfully."
      );

      setOpenResubmitModal(false);
      setSelectedRow(null);
      setRemarks("");
      setFile(null);

      if (
        typeof props.handleRefreshTable ===
        "function"
      ) {
        await props.handleRefreshTable();
      }
    } catch (error) {
      console.error(
        "Resubmit application error:",
        error
      );

      const message =
        error?.response?.data
          ?.resultString ||
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.result?.message ||
        error?.message ||
        "Failed to resubmit application.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     OPEN HISTORY
  ======================================================= */

  const handleOpenHistory = (row) => {
    setHistoryRow(row);
    setOpenHistoryModal(true);
  };

  /* =======================================================
     CLOSE HISTORY
  ======================================================= */

  const handleCloseHistory = () => {
    setOpenHistoryModal(false);
    setHistoryRow(null);
  };

  /* =======================================================
     HISTORY DATA
  ======================================================= */

  const history = useMemo(() => {
    return getApplicationHistory(
      historyRow
    );
  }, [historyRow]);

  /* =======================================================
     TABLE COLUMN COUNT
  ======================================================= */

  /*
   * table columns
   * + View
   * + Action
   * + History
   */
  const tableColumnCount =
    tableColumns.length + 3;

  /* =======================================================
     SELECTED STATUS LABEL
  ======================================================= */

  const selectedStatusLabel =
    BREEDER_STATUS_TABS.find(
      (tab) =>
        tab.value === selectedStatusTab
    )?.label || "ALL";

  /* =======================================================
     APPLICATION NUMBER
  ======================================================= */

  const historyApplicationNumber =
    historyRow?.applicationNumber ||
    historyRow?.registrationDetails
      ?.applicationNumber ||
    "-";

  /* =======================================================
     BREEDER NAME
  ======================================================= */

  const historyBreederName =
    historyRow?.breederName ||
    historyRow?.breederDetails
      ?.breederName ||
    historyRow?.breederDetails
      ?.name ||
    historyRow?.dogBreederDetail
      ?.breederName ||
    "-";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          STATUS TABS
      =================================================== */}

      <Box
        sx={{
          width: "100%",
          borderBottom: "1px solid #ddd",
          mb: 2,
        }}
      >
        <Tabs
          value={selectedStatusTab}
          onChange={
            handleStatusTabChange
          }
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
          {BREEDER_STATUS_TABS.map(
            (tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span>
                      {tab.label}
                    </span>

                    <Badge
                      badgeContent={
                        statusCounts[
                          tab.value
                        ] || 0
                      }
                      color="primary"
                      max={999}
                      sx={{
                        "& .MuiBadge-badge": {
                          position:
                            "relative",
                          transform:
                            "none",
                          top: "auto",
                          right: "auto",
                          minWidth: 20,
                          height: 20,
                          borderRadius:
                            "10px",
                          fontSize:
                            "0.7rem",
                        },
                      }}
                    />
                  </Box>
                }
              />
            )
          )}
        </Tabs>
      </Box>

      {/* ===================================================
          TABLE
      =================================================== */}

      <Table
        stickyHeader
        sx={{
          minWidth: 900,
        }}
      >
        <TableHead>
          <TableRow>
            {tableColumns.map(
              (col, index) => (
                <TableCell
                  key={
                    col.attr ||
                    index
                  }
                >
                  <TableSortLabel
                    onClick={() => {
                      if (
                        typeof props.handleSortClick ===
                        "function"
                      ) {
                        props.handleSortClick(
                          col.attr
                        );
                      }
                    }}
                    active={
                      col.attr ===
                      props
                        .sortAttributeDirection
                        ?.attr
                    }
                    direction={
                      col.attr ===
                      props
                        .sortAttributeDirection
                        ?.attr
                        ? props
                            .sortAttributeDirection
                            ?.direction ||
                          "asc"
                        : "asc"
                    }
                  >
                    {col.header}
                  </TableSortLabel>
                </TableCell>
              )
            )}

            {/* VIEW */}

            <TableCell align="center">
              View
            </TableCell>

            {/* ACTION */}

            <TableCell align="center">
              Action
            </TableCell>

            {/* HISTORY */}

            <TableCell align="center">
              History
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRows.map(
            (row, index) => {
              const applicationId =
                getApplicationId(row);

              const status =
                getRowStatus(row);

              const rejectedByCvo =
                isRejectedByCvo(row);

              const applicationRejected =
                isApplicationRejected(row);

              const approved =
                isApplicationApproved(row);

              return (
                <TableRow
                  key={
                    applicationId ||
                    index
                  }
                >
                  {/* =====================================
                      DATA COLUMNS
                  ====================================== */}

                  {tableColumns.map(
                    (
                      col,
                      colIndex
                    ) => (
                      <TableCell
                        key={
                          col.attr ||
                          colIndex
                        }
                      >
                        {col.attr ===
                        "status" ? (
                          <Chip
                            size="small"
                            label={getStatusLabel(
                              status
                            )}
                            color={getStatusChipColor(
                              status
                            )}
                          />
                        ) : typeof col.render ===
                          "function" ? (
                          col.render(
                            row
                          )
                        ) : (
                          String(
                            row[
                              col.attr
                            ] ??
                              ""
                          )
                        )}
                      </TableCell>
                    )
                  )}

                  {/* =====================================
                      VIEW
                  ====================================== */}

                  <TableCell align="center">
                    <Tooltip
                      title="View Application"
                    >
                      <IconButton
                        color="primary"
                        onClick={() => {
                          if (
                            typeof props.handleEditClick ===
                            "function"
                          ) {
                            props.handleEditClick(
                              applicationId,
                              row
                            );
                          }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  {/* =====================================
                      ACTION
                  ====================================== */}

                  <TableCell align="center">
                    {rejectedByCvo ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="warning"
                        startIcon={
                          <ReplayIcon />
                        }
                        onClick={() =>
                          handleOpenModal(
                            row
                          )
                        }
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
                            backgroundColor:
                              "#ffebee",
                            color:
                              "#d32f2f",
                            fontWeight:
                              "bold",
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
                            backgroundColor:
                              "#e8f5e9",
                            color:
                              "#2e7d32",
                            fontWeight:
                              "bold",
                          },
                        }}
                      >
                        APPROVED
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* =====================================
                      HISTORY
                  ====================================== */}

                  <TableCell align="center">
                    <Tooltip
                      title="View Application History"
                    >
                      <IconButton
                        color="secondary"
                        onClick={() =>
                          handleOpenHistory(
                            row
                          )
                        }
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            }
          )}

          {/* =============================================
              NO DATA
          ============================================== */}

          {filteredRows.length ===
            0 && (
            <TableRow>
              <TableCell
                colSpan={
                  tableColumnCount
                }
                align="center"
                sx={{
                  py: 4,
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  No applications found
                  for{" "}
                  {
                    selectedStatusLabel
                  }
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ===================================================
          RESUBMIT APPLICATION MODAL
      =================================================== */}

      <Dialog
        open={
          openResubmitModal
        }
        onClose={
          handleCloseModal
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          align="center"
          sx={{
            fontWeight: 600,
          }}
        >
          Resubmit Application
        </DialogTitle>

        <DialogContent
          dividers
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >
            {/* APPLICATION NUMBER */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Application Number
              </Typography>

              <Typography
                variant="body1"
                fontWeight={500}
              >
                {selectedRow
                  ?.applicationNumber ||
                  selectedRow
                    ?.registrationDetails
                    ?.applicationNumber ||
                  "-"}
              </Typography>
            </Box>

            {/* BREEDER NAME */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Breeder Name
              </Typography>

              <Typography
                variant="body1"
                fontWeight={500}
              >
                {selectedRow
                  ?.breederName ||
                  selectedRow
                    ?.breederDetails
                    ?.breederName ||
                  selectedRow
                    ?.breederDetails
                    ?.name ||
                  selectedRow
                    ?.dogBreederDetail
                    ?.breederName ||
                  "-"}
              </Typography>
            </Box>

            {/* CURRENT STATUS */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Current Status
              </Typography>

              <Typography
                variant="body1"
                fontWeight={600}
                color="error.main"
              >
                {getStatusLabel(
                  getRowStatus(
                    selectedRow
                  )
                )}
              </Typography>
            </Box>

            {/* REMARKS */}

            <TextField
              fullWidth
              multiline
              rows={3}
              required
              label="Remarks"
              placeholder="Enter remarks..."
              value={remarks}
              onChange={(e) =>
                setRemarks(
                  e.target.value
                )
              }
              disabled={
                isSubmitting
              }
            />

            {/* SUPPORTING DOCUMENT */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mb: 1,
                  display: "block",
                }}
              >
                Supporting Documents
              </Typography>

              <Button
                variant="contained"
                component="label"
                startIcon={
                  <CloudUploadIcon />
                }
                disabled={
                  isSubmitting
                }
              >
                Upload Documents

                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={
                    handleFileChange
                  }
                />
              </Button>

              {file && (
                <Typography
                  variant="caption"
                  display="block"
                  color="primary"
                  sx={{
                    mt: 1,
                    wordBreak:
                      "break-word",
                  }}
                >
                  Selected:{" "}
                  {file.name}
                </Typography>
              )}

              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Supported Formats:
                PDF, JPG, JPEG, PNG
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={
              handleSubmitResubmit
            }
            disabled={
              isSubmitting ||
              !remarks.trim()
            }
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit"}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={
              handleCloseModal
            }
            disabled={
              isSubmitting
            }
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================
          APPLICATION HISTORY MODAL
      =================================================== */}

      <Dialog
        open={openHistoryModal}
        onClose={
          handleCloseHistory
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <HistoryIcon color="primary" />

            <span>
              Application History
            </span>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* =========================================
              APPLICATION INFORMATION
          ========================================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Application Number
              </Typography>

              <Typography
                variant="body1"
                fontWeight={600}
              >
                {historyApplicationNumber}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Breeder Name
              </Typography>

              <Typography
                variant="body1"
                fontWeight={600}
              >
                {historyBreederName}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Current Status
              </Typography>

              <Box sx={{ mt: 0.5 }}>
                <Chip
                  size="small"
                  label={getStatusLabel(
                    getRowStatus(
                      historyRow
                    )
                  )}
                  color={getStatusChipColor(
                    getRowStatus(
                      historyRow
                    )
                  )}
                />
              </Box>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Application ID
              </Typography>

              <Typography
                variant="body1"
                fontWeight={500}
              >
                {getApplicationId(
                  historyRow
                ) || "-"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* =========================================
              HISTORY TITLE
          ========================================== */}

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            Status History
          </Typography>

          {/* =========================================
              NO HISTORY
          ========================================== */}

          {history.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 5,
              }}
            >
              <HistoryIcon
                sx={{
                  fontSize: 50,
                  color: "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                color="text.secondary"
              >
                No history available
                for this application.
              </Typography>
            </Box>
          ) : (
            /* =========================================
               HISTORY TABLE
            ========================================== */

            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
              }}
            >
              <Table
                size="small"
                sx={{
                  minWidth: 650,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      #
                    </TableCell>

                    <TableCell>
                      Date
                    </TableCell>

                    <TableCell>
                      Status
                    </TableCell>

                    <TableCell>
                      Remarks
                    </TableCell>

                    <TableCell>
                      Updated By
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {history.map(
                    (
                      item,
                      index
                    ) => {
                      const itemStatus =
                        getHistoryStatus(
                          item
                        );

                      return (
                        <TableRow
                          key={
                            item?.id ||
                            index
                          }
                        >
                          <TableCell>
                            {index + 1}
                          </TableCell>

                          <TableCell>
                            {getHistoryDate(
                              item
                            )}
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={getStatusLabel(
                                itemStatus
                              )}
                              color={getStatusChipColor(
                                itemStatus
                              )}
                            />
                          </TableCell>

                          <TableCell
                            sx={{
                              maxWidth: 300,
                              whiteSpace:
                                "normal",
                              wordBreak:
                                "break-word",
                            }}
                          >
                            {getHistoryRemarks(
                              item
                            )}
                          </TableCell>

                          <TableCell>
                            {getHistoryUser(
                              item
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={
              handleCloseHistory
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/* =========================================================
   PROP TYPES
========================================================= */

List.propTypes = {
  alertString:
    PropTypes.string,

  api_url:
    PropTypes.string,

  handleEditClick:
    PropTypes.func,

  handleRefreshTable:
    PropTypes.func,

  handleSortClick:
    PropTypes.func,

  rows:
    PropTypes.array,

  handleForwardClick:
    PropTypes.func,

  sortAttributeDirection:
    PropTypes.shape({
      attr:
        PropTypes.string,

      direction:
        PropTypes.string,
    }),

  tableColumns:
    PropTypes.array,

  canEdit:
    PropTypes.bool,

  canDelete:
    PropTypes.bool,
};

/* =========================================================
   DEFAULT PROPS
========================================================= */

List.defaultProps = {
  alertString: "",

  api_url: "",

  handleEditClick:
    undefined,

  handleRefreshTable:
    undefined,

  handleSortClick:
    undefined,

  rows: [],

  handleForwardClick:
    undefined,

  sortAttributeDirection: {
    attr: "",
    direction: "asc",
  },

  tableColumns: [],

  canEdit: false,

  canDelete: false,
};

export default List;