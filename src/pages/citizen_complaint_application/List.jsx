import PropTypes from "prop-types";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
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
                  onClick={() =>
                    col.attr && props.handleSortClick(col.attr)
                  }
                  active={
                    col.attr ===
                    props.sortAttributeDirection?.attr
                  }
                  direction={
                    col.attr ===
                    props.sortAttributeDirection?.attr
                      ? props.sortAttributeDirection?.direction
                      : "asc"
                  }
                >
                  {col.header}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell align="center">
              View
            </TableCell>

            <TableCell align="center">
              History
            </TableCell>

            <TableCell align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows?.map((row, index) => {
            const status = normalizeStatusName(
              row?.status ||
                row?.statusName ||
                row?.statusCode ||
                row?.currentStatus ||
                row?.applicationStatus ||
                row?.applicationStatusName ||
                row?.approvalStatus
            );

            return (
              <TableRow key={row?.id ?? index}>
                {props.tableColumns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {typeof col.render === "function"
                      ? col.render(row)
                      : String(row?.[col.attr] ?? "-")}
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Tooltip title="View Complaint">
                    <IconButton
                      onClick={() =>
                        props.handleEditClick?.(row.id)
                      }
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
                  {matchesStatus(status, "submitted") && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        props.handleForwardClick?.(row.id)
                      }
                    >
                      FORWARD
                    </Button>
                  )}

                  {matchesStatus(status, "forwarded to cvo") && (
                    <Button
                      variant="contained"
                      size="small"
                      disabled
                      sx={{
                        "&.Mui-disabled": {
                          backgroundColor: "#e0e0e0",
                          color: "#757575",
                          opacity: 0.7,
                          boxShadow: "none",
                        },
                      }}
                    >
                      FORWARDED TO CVO
                    </Button>
                  )}

                  {matchesStatus(status, "verified by cvo") && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() =>
                          props.handleApproveClick?.(row.id)
                        }
                      >
                        APPROVE
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          props.handleRejectClick?.(row.id)
                        }
                      >
                        REJECT
                      </Button>
                    </>
                  )}

                  {matchesStatus(status, "application approved") && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled
                    >
                      APPROVED
                    </Button>
                  )}

                  {matchesStatus(status, "application rejected") && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      disabled
                    >
                      REJECTED
                    </Button>
                  )}

                  {matchesStatus(status, "rejected by cvo") && (
                    <Button
                      variant="contained"
                      size="small"
                      disabled
                      sx={{
                        "&.Mui-disabled": {
                          backgroundColor: "#e0e0e0",
                          color: "#757575",
                          opacity: 0.7,
                          boxShadow: "none",
                        },
                      }}
                    >
                      REJECTED BY CVO
                    </Button>
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
  rows: PropTypes.array,

  tableColumns: PropTypes.array,

  handleEditClick: PropTypes.func,

  handleForwardClick: PropTypes.func,

  handleApproveClick: PropTypes.func,

  handleRejectClick: PropTypes.func,

  handleSortClick: PropTypes.func,

  sortAttributeDirection: PropTypes.object,
};

export default List;