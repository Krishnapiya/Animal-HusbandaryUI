import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
// import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import { useState } from "react";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";
import { toast } from "material-react-toastify";
import { togglePetShopInspectionVisibility } from "../../api-client/petShopRegistration";
import PetShopStatusHistoryDialog from "../../components/PetShopStatusHistoryDialog";
import PetShopInspectionReportDialog from "../../components/PetShopInspectionReportDialog";

const normalizeStatusName = (value) => {
  const raw =
    typeof value === "string"
      ? value
      : value?.name ||
        value?.status ||
        value?.statusName ||
        value?.statusCode ||
        value?.currentStatus ||
        value?.applicationStatus ||
        value?.applicationStatusName ||
        value?.approvalStatus ||
        value?.value ||
        value?.code ||
        "";

  return String(raw)
    .trim()
    .replace(/[_\s-]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const matchesStatus = (value, ...expected) => {
  const normalized = normalizeStatusName(value);
  return expected.some((status) => {
    const expectedNormalized = normalizeStatusName(status);
    return normalized === expectedNormalized || normalized.includes(expectedNormalized);
  });
};

const List = (props) => {
  const [historyApplicationId, setHistoryApplicationId] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReportRow, setSelectedReportRow] = useState(null);

  const handleOpenReportModal = (row) => {
    setSelectedReportRow(row);
    setReportDialogOpen(true);
  };

  const handleToggleVisibility = async (applicationId, nextVisible) => {
    try {
      const res = await togglePetShopInspectionVisibility(applicationId, nextVisible);
      if (res?.isSuccess !== false) {
        toast.success(nextVisible ? "Inspection date revealed to applicant" : "Inspection date hidden from applicant");
        if (typeof props.handleRefreshTable === "function") {
          props.handleRefreshTable();
        } else {
          window.location.reload();
        }
      } else {
        toast.error("Failed to update visibility");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update visibility");
    }
  };

  return (
    <>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {props.tableColumns.map((col, index) => (
              <TableCell key={index}>
                <TableSortLabel
                  onClick={props.handleSortClick(col.attr)}
                  active={col.attr === props.sortAttributeDirection.attr}
                  direction={
                    col.attr === props.sortAttributeDirection.attr
                      ? props.sortAttributeDirection.direction
                      : "asc"
                  }
                >
                  {col.header}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell align="center">View</TableCell>
            <TableCell align="center">History</TableCell>
            <TableCell align="center">Report</TableCell>
            <TableCell align="center">Actions</TableCell>
            <TableCell align="center">Decision</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => {
            const statusName = normalizeStatusName(
              row?.status ||
                row?.statusName ||
                row?.statusCode ||
                row?.currentStatus ||
                row?.applicationStatus ||
                row?.applicationStatusName ||
                row?.approvalStatus
            );
            const isInspectionScheduled = matchesStatus(
              statusName,
              "inspection scheduled",
              "INSPECTION_SCHEDULED"
            );
            const isVerifiedByCvo = matchesStatus(
              statusName,
              "verified by cvo",
              "VERIFIED_BY_CVO"
            );
            const isRejectedByCvo = matchesStatus(
              statusName,
              "rejected by cvo",
              "REJECTED_BY_CVO",
              "rejected",
              "application rejected"
            );
            const isCompleted = isVerifiedByCvo || isRejectedByCvo;

            return (
              <TableRow key={index}>
                {props.tableColumns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {typeof col.render === "function"
                      ? col.render(row)
                      : String(row[col.attr])}
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Tooltip title="View Application">
                    <IconButton onClick={() => props.handleEditClick(row.id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Status History">
                    <IconButton onClick={() => setHistoryApplicationId(row.id)}>
                      <HistoryIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  <Tooltip
                    title={
                      isCompleted || Boolean(row?.inspectionReport)
                        ? "View Inspection Report"
                        : "No Inspection Report"
                    }
                  >
                    <span>
                      <IconButton
                        color={
                          isCompleted || Boolean(row?.inspectionReport)
                            ? "primary"
                            : "default"
                        }
                        disabled={!isCompleted && !row?.inspectionReport}
                        onClick={() => handleOpenReportModal(row)}
                      >
                        <AssignmentIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  {(() => {
                    if (isCompleted) {
                      return (
                        <Button
                          variant="contained"
                          color={isVerifiedByCvo ? "success" : "error"}
                          size="small"
                          startIcon={<EventIcon />}
                          disabled
                        >
                          {isVerifiedByCvo ? "Verified" : "Rejected"}
                        </Button>
                      );
                    }

                    if (isInspectionScheduled) {
                      return (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            startIcon={<EventIcon />}
                            disabled
                          >
                            Scheduled
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color={row?.inspectionDateVisible ? "success" : "warning"}
                            startIcon={row?.inspectionDateVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            onClick={() => handleToggleVisibility(row.id, !row?.inspectionDateVisible)}
                            sx={{ fontSize: "0.72rem", py: 0.2, px: 0.8, textTransform: "none", whiteSpace: "nowrap" }}
                          >
                            {row?.inspectionDateVisible ? "Date Revealed" : "Date Hidden"}
                          </Button>
                        </Box>
                      );
                    }

                    return (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={<EventIcon />}
                        onClick={() => props.handleScheduleInspection(row.id)}
                      >
                        Schedule Inspection
                      </Button>
                    );
                  })()}
                </TableCell>

                <TableCell align="center">
                  {isInspectionScheduled ? (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => props.handleUploadReport(row.id)}
                    >
                      Upload Report
                    </Button>
                  ) : isVerifiedByCvo ? (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        disabled
                        sx={{
                          "&.Mui-disabled": {
                            backgroundColor: "#2e7d32",
                            color: "#fff",
                            opacity: 1,
                          },
                        }}
                      >
                        ✓ Verified by CVO
                      </Button>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handleOpenReportModal(row)}
                      >
                        Report
                      </Button>
                    </Box>
                  ) : isRejectedByCvo ? (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        disabled
                        sx={{
                          "&.Mui-disabled": {
                            backgroundColor: "#d32f2f",
                            color: "#fff",
                            opacity: 1,
                          },
                        }}
                      >
                        ✗ Rejected by CVO
                      </Button>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handleOpenReportModal(row)}
                      >
                        Report
                      </Button>
                    </Box>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
 <PetShopStatusHistoryDialog
      applicationId={historyApplicationId}
      setApplicationId={setHistoryApplicationId}
    />

      <PetShopInspectionReportDialog
        open={reportDialogOpen}
        onClose={() => {
          setReportDialogOpen(false);
          setSelectedReportRow(null);
        }}
        applicationId={selectedReportRow?.id}
        applicationNumber={selectedReportRow?.applicationNumber}
      />
     
    </>
  );
};

List.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  handleEditClick: PropTypes.func,
  handleRefreshTable: PropTypes.func,
  handleSortClick: PropTypes.func,
  rows: PropTypes.array,
  handleForwardClick: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
  tableColumns: PropTypes.array,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  handleScheduleInspection: PropTypes.func,
  handleUploadReport: PropTypes.func,
};

export default List;