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
<TableCell align="center">
  <Tooltip title="View Status History">
    <IconButton
      onClick={() => setHistoryApplicationId(row.id)}
    >
      <HistoryIcon color="primary" />
    </IconButton>
  </Tooltip>
</TableCell>

<>
{/* Actions */}
<TableCell align="center">
  {(() => {
   const inspectionScheduled =
  row.status?.name === "Inspection Scheduled" ||
  row.status?.name === "Verified by CVO" ||
  row.status?.name === "Rejected by CVO" ||
  row.status?.name === "Application Approved" ||
  row.status?.name === "Application Rejected";

    return (
      <Button
        variant="contained"
        color={inspectionScheduled ? "success" : "warning"}
        size="small"
        startIcon={<EventIcon />}
        disabled={inspectionScheduled}
        onClick={() => props.handleScheduleInspection(row.id)}
      >
        {inspectionScheduled ? "Scheduled" : "Schedule Inspection"}
      </Button>
    );
  })()}
</TableCell>

{/* Report */}
{/* Decision */}
<TableCell align="center">
  {row.status?.name === "Inspection Scheduled" ? (
  <Button
    variant="contained"
    color="info"
    size="small"
    onClick={() => props.handleUploadReport(row.id)}
  >
    Upload Report
  </Button>
) : row.status?.name === "Verified by CVO" ? (
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
) : row.status?.name === "Rejected by CVO" ? (
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
</>
            </TableRow>
          ))}
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