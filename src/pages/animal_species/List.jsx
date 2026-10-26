import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import EditButton from "../../components/button/EditButton";
import DeleteButton from "../../components/button/DeleteButton";
import DeleteDialog from "../../components/DeleteDialog";

const List = (props) => {
  const [deleteRowID, setDeleteRowID] = useState("");

  const speciesLookup = useMemo(() => {
    const map = new Map();
    const dropdownList = props.dropDownLists?.animalSpecies || [];
    dropdownList.forEach((item) => {
      if (item.id != null) {
        map.set(String(item.id), item.speciesName || item.name || "");
      }
    });
    (props.rows || []).forEach((row) => {
      if (row.id != null && !map.has(String(row.id))) {
        map.set(String(row.id), row.speciesName || row.name || "");
      }
    });
    return map;
  }, [props.dropDownLists, props.rows]);

  return (
    <>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {props.tableColumns.map((col, index) => (
              <TableCell key={index}>
                {col.sortable === false ? (
                  col.header
                ) : (
                  <TableSortLabel
                    onClick={props.handleSortClick(col.attr)}
                    active={
                      col.attr ===
                      props.sortAttributeDirection.attr
                    }
                    direction={
                      col.attr ===
                      props.sortAttributeDirection.attr
                        ? props.sortAttributeDirection.direction
                        : "asc"
                    }
                  >
                    {col.header}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}

            {props.canEdit && (
              <TableCell>Edit</TableCell>
            )}

            {props.canDelete && (
              <TableCell>Delete</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => {
            const isBreed = row.parentId != null && row.parentId !== "";
            const parentName = isBreed
              ? speciesLookup.get(String(row.parentId)) || row.parentSpeciesName || row.parentName || "-"
              : "-";

            return (
              <TableRow key={row.id ?? index}>
                {props.tableColumns.map(
                  (col, colIndex) => {
                    let cellContent = "";
                    if (col.attr === "speciesName") {
                      cellContent = row.speciesName || "";
                    } else if (col.attr === "type") {
                      cellContent = isBreed ? "Breed" : "Species";
                    } else if (col.attr === "parentSpecies") {
                      cellContent = parentName;
                    } else if (col.attr === "isActive") {
                      cellContent = row.isActive ? "Yes" : "No";
                    } else {
                      cellContent = row[col.attr] ?? "";
                    }

                    return (
                      <TableCell key={colIndex}>
                        {cellContent}
                      </TableCell>
                    );
                  }
                )}

                {props.canEdit && (
                  <TableCell>
                    <EditButton
                      onClick={() =>
                        props.handleEditClick(row.id)
                      }
                    />
                  </TableCell>
                )}

                {props.canDelete && (
                  <TableCell>
                    <DeleteButton
                      onClick={() =>
                        setDeleteRowID(row.id)
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
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
  dropDownLists: PropTypes.object,
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