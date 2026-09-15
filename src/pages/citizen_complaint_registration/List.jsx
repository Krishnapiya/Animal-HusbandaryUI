import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import ComplaintRegistrationStatusHistoryDialog from "../../components/ComplaintRegistrationStatusHistoryDialog";

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
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.length > 0 ? (
            props.rows.map((row) => (
              <TableRow key={row.id}>
                {props.tableColumns.map((col) => (
                  <TableCell key={col.attr}>
                    {typeof row[col.attr] === "object" && row[col.attr] !== null
                      ? row[col.attr].name
                      : row[col.attr]}
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Tooltip title="View Complaint">
                    <IconButton
                      onClick={() => props.handleViewClick?.(row.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="View Action History">
                    <IconButton onClick={() => setHistoryComplaintId(row.id)}>
                      <HistoryIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => props.handleEditClick(row.id)}
                      disabled={!props.canEdit}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={props.tableColumns.length + 3}
                align="center"
              >
                No Records Found
              </TableCell>
            </TableRow>
          )}
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
  handleViewClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  handleSortClick: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
  canEdit: PropTypes.bool,
};

export default List;