/*eslint-disable*/
import PropTypes from "prop-types";
import { useState, cloneElement, Children } from "react";
import Pagination from "@mui/material/Pagination";
import useFetchTable from "../../hooks/useFetchTable";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import useModal from "../../hooks/useModal";
import LoadingPercentageBackDrop from "../../components/LoadingPercentageBackDrop";
import PageTitle from "../../components/PageTitle";
import TableContainer from "@mui/material/TableContainer";
import SearchField from "../FormComponents/SearchField";
import XLSDownload from "./XLSDownload";
import FilterDialog from "./FilterDialog";
import AddButton from "../button/AddButton";
import Tooltip from "@mui/material/Tooltip";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import IconButton from "@mui/material/IconButton";
import RecordsPerPage from "./RecordsPerPage";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";
const DataTable = (props) => {
  const children_array = Children.toArray(props.children);
  const {
    rows,
    totalRows,
    // rowsInCurrentPage,
    pageCount,
    progress,
    isTableLoading,
    fetchParams,
    handleChangePage,
    handleChangePageSize,
    handleSortTable,
    handleSearchTable,
    handleFilterTable,
    handleResetTable,
    handleRefreshTable,
  } = useFetchTable(props.list_url);

  //------------------------FOR EDIT-----------------------------
  const [openFormModal, handleOpenFormModal, handleCloseFormModal] = useModal();
  const [operationType, setOperationType] = useState("");
  const [rowID, setRowID] = useState("");
  const handleEditClick = (id) => {
    handleOpenFormModal();
    setOperationType("edit");
    setRowID(id);
  };
  useEffect(() => {
    console.log("ROWWWWIDDD--->", rowID);
  }, [rowID]);

  //---------------------------------------------------------
  //------------------------FOR SORTING----------------------
  const [sortAttributeDirection, setSortAttributeDirection] = useState({
    attr: "",
    direction: "asc",
  });
  const handleSortClick = (attr) => () => {
    if (sortAttributeDirection.attr === attr) {
      if (sortAttributeDirection.direction === "asc") {
        setSortAttributeDirection({
          ...sortAttributeDirection,
          direction: "desc",
        });
        handleSortTable(attr,"asc");
      } else {
        setSortAttributeDirection({
          ...sortAttributeDirection,
          direction: "asc",
        });
        handleSortTable(attr,"desc");
      }
    } else {
      setSortAttributeDirection({
        attr: attr,
        direction: "asc",
      });
      handleSortTable(attr);
    }
  };

  //---------------------------------------------------------
  const handleAddButtonClick = () => {
    handleOpenFormModal();
    setOperationType("insert");
  };
  //----------------------------------------------------------
  const [clearAttributeFilter, setClearAttributeFilter] = useState(false);
  const handleClearFilter = () => {
    handleResetTable();
    setClearAttributeFilter(true);
  };

  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 0.5,
        }}
      >
        {props.disableAdd ? (
          <Box></Box>
        ) : (
          <Box>
            <AddButton
              onClick={handleAddButtonClick}
              title={props.alertString}
              is_disabled={props.disableAdd}
            />
          </Box>
        )}
        <PageTitle title={props.pageTitle} />
        <Box sx={{ display: "flex" }} gap={1}>
          <SearchField handleSearch={handleSearchTable} />
          {props.canExport === true ? (
            <XLSDownload
              listURL={props.list_url}
              fetchParams={fetchParams}
              tableColumns={props.tableColumns}
              fileName={props.alertString}
            />
          ) : null}
          {props.includeFilter ? (
            <FilterDialog
              dropDownLists={props.dropDownLists}
              handleFilterTable={handleFilterTable}
              handleResetTable={handleResetTable}
              clearAttributeFilter={clearAttributeFilter}
              setClearAttributeFilter={setClearAttributeFilter}
            >
              {cloneElement(children_array[0])}
            </FilterDialog>
          ) : (
            ""
          )}
          <Tooltip title="Reset" placement="bottom">
            <IconButton onClick={handleClearFilter} color="secondary">
              <RestartAltRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {/* FormDialog */}
      {cloneElement(children_array[1], {
        alertString: props.alertString,
        api_url: props.api_url,
        handleRefreshTable: handleRefreshTable,
        open: openFormModal,
        handleOpen: handleOpenFormModal,
        handleCloseFormModal: handleCloseFormModal,
        operationType: operationType,
        setOperationType: setOperationType,
        rowID: rowID,
        setRowID: setRowID,
        dropDownLists: props.dropDownLists,
        canSave: !props.disableAdd,
        tableColumns: props.tableColumns,
      })}
      {/* List */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "72vh" }}>
          {props.canList === false ? (
            <Box sx={{ p: 3 }}>
              <Typography>You do not have list permission for this module.</Typography>
            </Box>
          ) : (
            cloneElement(children_array[2], {
              rows: rows,
              api_url: props.api_url,
              tableColumns: props.tableColumns,
              alertString: props.alertString,
              handleEditClick: handleEditClick,
              handleForwardClick: props.handleForwardClick,
              handleRefreshTable: handleRefreshTable,
              sortAttributeDirection: sortAttributeDirection,
              setSortAttributeDirection: setSortAttributeDirection,
              handleSortClick: handleSortClick,
              canEdit: props.canEdit,
              canDelete: props.canDelete,
              dropDownLists: props.dropDownLists,
            })
          )}
        </TableContainer>

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          sx={{ padding: 1 }}
        >
          {totalRows ? (
            <>
              <Pagination
                count={pageCount}
                page={fetchParams.page}
                defaultPage={1}
                boundaryCount={2}
                onChange={handleChangePage}
                color="primary"
                showFirstButton
                showLastButton
              />
              {/* <Box sx={{ paddingTop: 0.5 }}>
                {(fetchParams.page - 1) * page_size + 1} to{" "}
                {fetchParams.page * rowsInCurrentPage} of {totalRows} Records
              </Box> */}

              {/* <RecordsPerPage
                fetchParams={fetchParams}
                handleChangePageSize={handleChangePageSize}
              />
              <Box sx={{ paddingTop: 0.5 }}>
                {Math.min(
                  (fetchParams.page - 1) * fetchParams.page_size + 1,
                  totalRows,
                )}{" "}
                to{" "}
                {Math.min(fetchParams.page * fetchParams.page_size, totalRows)}{" "}
                of {totalRows} Records
              </Box> */}
            </>
          ) : (
            <Box sx={{ paddingTop: 0.5 }}>0 to 0 of 0 Records</Box>
          )}
        </Stack>
      </Paper>

      <LoadingPercentageBackDrop open={isTableLoading} progress={progress} />
    </Paper>
  );
};

DataTable.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  children: PropTypes.any,
  disableAdd: PropTypes.bool,
  dropDownLists: PropTypes.object,
  fetchFields: PropTypes.object,
  filterConfig: PropTypes.object,
  includeFilter: PropTypes.bool,
  list_url: PropTypes.string,
  pageTitle: PropTypes.string,
  tableColumns: PropTypes.array,
  canList: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  canExport: PropTypes.bool,
};

export default DataTable;
//useTable hook to set rows count .....
