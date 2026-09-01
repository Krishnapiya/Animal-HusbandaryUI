import PropTypes from "prop-types";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import PetShopStatusHistoryDialog from "../../components/PetShopStatusHistoryDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HistoryIcon from "@mui/icons-material/History";
import ReplayIcon from "@mui/icons-material/Replay";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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

          <TableCell align="center">
            View
          </TableCell>
 <TableCell align="center">
            History 
          </TableCell>
          <TableCell align="center">
    Resubmit
</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>

        {props.rows.map((row, index) => (

          <TableRow key={index}>
            

            {props.tableColumns.map((col, colIndex) => (
              <TableCell key={colIndex}>
                {typeof col.render === "function"
                  ? col.render(row)
                  : String(row[col.attr] || "-")}
              </TableCell>
            ))}

            <TableCell align="center">
              <Tooltip title="View">
                <IconButton
                  onClick={() => props.handleEditClick(row.id)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell align="center">
  <Tooltip title="History">
    <IconButton
      onClick={() => setHistoryApplicationId(row.id)}
    >
      <HistoryIcon color="primary" />
    </IconButton>
  </Tooltip>
</TableCell>
<TableCell align="center">

    {row.status?.name === "Rejected by CVO" ? (

        <Button
            variant="contained"
            color="warning"
            size="small"
            startIcon={<ReplayIcon />}
            onClick={() => props.handleResubmitClick(row)}
        >
            Resubmit
        </Button>

    ) : row.status?.name === "Resubmitted" ? (

        <Chip
            icon={<ReplayIcon />}
            label="Resubmitted"
            color="info"
            variant="outlined"
            sx={{
                opacity: 0.6,
                fontWeight: 600,
            }}
        />

    ) : null}

</TableCell>

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
  rows: PropTypes.array,
  tableColumns: PropTypes.array,
  handleEditClick: PropTypes.func,
  handleSortClick: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
  handleResubmitClick: PropTypes.func,
};

export default List;