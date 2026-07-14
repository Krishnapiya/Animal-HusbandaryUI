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

const List = (props) => {

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
{/* <TableCell align="center">Actions</TableCell> */}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={index}>
              {props.tableColumns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {typeof col.render === "function"
                    ? col.render(row)
                    : String(row[col.attr])}
                </TableCell>
              ))}

              {/* View */}
<TableCell align="center">
    <Tooltip title="View Application">
        <IconButton
            onClick={() => props.handleEditClick(row.id)}
        >
            <VisibilityIcon />
        </IconButton>
    </Tooltip>
</TableCell>

{/* Actions
<TableCell align="center">
    <Button
        variant="contained"
        color="success"
        size="small"
        onClick={() => props.handleForwardClick(row.id)}
    >
        FORWARD
    </Button>
</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

     
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
};

export default List;