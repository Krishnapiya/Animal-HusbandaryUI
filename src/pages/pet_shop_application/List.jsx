import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useState } from "react";
import HistoryIcon from "@mui/icons-material/History";
import PetShopStatusHistoryDialog from "../../components/PetShopStatusHistoryDialog";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

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
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => {
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
                    if (
                      matchesStatus(status, "submitted", "resubmitted")
                    ) {
                      return (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => props.handleForwardClick(row.id)}
                        >
                          FORWARD
                        </Button>
                      );
                    }

                    if (
                      matchesStatus(
                        status,
                        "forwarded to cvo",
                        "inspection scheduled"
                      )
                    ) {
                      return (
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
                      );
                    }

                    if (
                      matchesStatus(
                        status,
                        "verified by cvo",
                        "rejected by cvo"
                      )
                    ) {
                      return (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => props.handleApproveClick(row.id)}
                          >
                            APPROVE
                          </Button>

                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => props.handleRejectClick(row.id)}
                          >
                            REJECT
                          </Button>
                        </>
                      );
                    }

                    if (status === "application approved") {
                      return (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled
                        >
                          APPROVED
                        </Button>
                      );
                    }

                    if (status === "application rejected") {
                      return (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          disabled
                        >
                          REJECTED
                        </Button>
                      );
                    }

                    return null;
                  })()}
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
  handleApproveClick: PropTypes.func,
handleRejectClick: PropTypes.func,
};

export default List;