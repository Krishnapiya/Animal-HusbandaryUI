import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
// import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import { useState } from "react";
import HistoryIcon from "@mui/icons-material/History";
import PetShopStatusHistoryDialog from "../../components/PetShopStatusHistoryDialog";
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
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          startIcon={<EventIcon />}
                          disabled
                        >
                          Scheduled
                        </Button>
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
                  ) : isRejectedByCvo ? (
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