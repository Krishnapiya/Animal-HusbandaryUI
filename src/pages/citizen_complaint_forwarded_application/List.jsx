import PropTypes from "prop-types";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ComplaintRegistrationStatusHistoryDialog from "../../components/ComplaintRegistrationStatusHistoryDialog";

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

    return (
      normalized === expectedNormalized ||
      normalized.includes(expectedNormalized)
    );
  });
};

const List = (props) => {
  const [historyComplaintId, setHistoryComplaintId] = useState("");

  return (
    <>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {props.tableColumns.map((col, index) => (
              <TableCell key={index}>
                <TableSortLabel
                  onClick={() => props.handleSortClick(col.attr)}
                  active={
                    col.attr === props.sortAttributeDirection.attr
                  }
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
            <TableCell align="center">Action</TableCell>
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

            const isForwardedToCvo = matchesStatus(
              statusName,
              "FORWARDED_TO_CVO",
              "forwarded to cvo"
            );

            const isUnderReview = matchesStatus(
              statusName,
              "UNDER_REVIEW",
              "under review"
            );

            const isInvestigationScheduled = matchesStatus(
              statusName,
              "INVESTIGATION_SCHEDULED",
              "investigation scheduled"
            );

            const isVerifiedByCvo = matchesStatus(
              statusName,
              "VERIFIED_BY_CVO",
              "verified by cvo"
            );

            const isRejectedByCvo = matchesStatus(
              statusName,
              "REJECTED_BY_CVO",
              "rejected by cvo"
            );

            return (
              <TableRow key={index}>
                {props.tableColumns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {typeof col.render === "function"
                      ? col.render(row)
                      : String(row[col.attr] ?? "-")}
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Tooltip title="View Complaint">
                    <IconButton
                      onClick={() => props.handleEditClick(row.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="View Status History">
                    <IconButton onClick={() => setHistoryComplaintId(row.id)}>
                      <HistoryIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  {isForwardedToCvo && (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<RateReviewIcon />}
                      onClick={() =>
                        props.handleStartReview(row.id)
                      }
                    >
                      Start Review
                    </Button>
                  )}

                  {isUnderReview && (
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      startIcon={<EventIcon />}
                      onClick={() =>
                        props.handleScheduleInvestigation(row.id)
                      }
                    >
                      Schedule Investigation
                    </Button>
                  )}

                  {isInvestigationScheduled && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() =>
                        props.handleActionTaken(row.id)
                      }
                    >
                      Verify / Reject
                    </Button>
                  )}

                  {isVerifiedByCvo && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled
                      startIcon={<CheckCircleIcon />}
                    >
                      Verified by CVO
                    </Button>
                  )}

                  {isRejectedByCvo && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      disabled
                      startIcon={<EventIcon />}
                    >
                      Rejected by CVO
                    </Button>
                  )}

                  {!isForwardedToCvo &&
                    !isUnderReview &&
                    !isInvestigationScheduled &&
                    !isVerifiedByCvo &&
                    !isRejectedByCvo && (
                      <span>-</span>
                    )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ComplaintRegistrationStatusHistoryDialog
        complaintId={historyComplaintId}
        setComplaintId={setHistoryComplaintId}
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
  sortAttributeDirection: PropTypes.object,
  tableColumns: PropTypes.array,

  handleStartReview: PropTypes.func,
  handleScheduleInvestigation: PropTypes.func,
  handleActionTaken: PropTypes.func,
};

export default List;