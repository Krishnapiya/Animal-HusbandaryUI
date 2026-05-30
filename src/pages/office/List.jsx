import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import EditButton from "../../components/button/EditButton";
import DeleteButton from "../../components/button/DeleteButton";
import DeleteDialog from "../../components/DeleteDialog";
import { useState } from "react";

const List = (props) => {
  const [deleteRowID, setDeleteRowID] = useState("");

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
            {props.canEdit ? <TableCell>Edit</TableCell> : null}
            {props.canDelete ? <TableCell>Delete</TableCell> : null}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={index}>
              {props.tableColumns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {typeof col.render === "function" ? col.render(row) : row[col.attr]}
                </TableCell>
              ))}
              {props.canEdit ? (
                <TableCell>
                  <EditButton onClick={() => props.handleEditClick(row.id)} />
                </TableCell>
              ) : null}
              {props.canDelete ? (
                <TableCell>
                  <DeleteButton onClick={() => setDeleteRowID(row.id)} />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteDialog
        id={deleteRowID}
        api_url={props.api_url}
        alertString={props.alertString}
        setID={setDeleteRowID}
        handleRefreshTable={props.handleRefreshTable}
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
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default List;
