/*eslint-disable*/
import PropTypes from "prop-types";
import { useState, cloneElement, Children, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import NotificationsIcon from "@mui/icons-material/Notifications";

import useFetchTable from "../../hooks/useFetchTable";
import useModal from "../../hooks/useModal";
import LoadingPercentageBackDrop from "../../components/LoadingPercentageBackDrop";
import PageTitle from "../../components/PageTitle";
import TableContainer from "@mui/material/TableContainer";
import SearchField from "../FormComponents/SearchField";
import XLSDownload from "./XLSDownload";
import FilterDialog from "./FilterDialog";
import AddButton from "../button/AddButton";
import RecordsPerPage from "./RecordsPerPage";
import ResubmitDialog from "../../pages/pet_shop_my_applications/ResubmitDialog";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api-client/notification";

const DataTable = (props) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Resubmit Dialog States (Moved to component level)
  const [resubmitApplication, setResubmitApplication] = useState(null);
  const [openResubmitDialog, setOpenResubmitDialog] = useState(false);

  // Form Modal & Table States
  const [openFormModal, handleOpenFormModal, handleCloseFormModal] = useModal();
  const [operationType, setOperationType] = useState("");
  const [rowID, setRowID] = useState("");
  const [rowData, setRowData] = useState(null);

  const [sortAttributeDirection, setSortAttributeDirection] = useState({
    attr: "",
    direction: "asc",
  });
  const [clearAttributeFilter, setClearAttributeFilter] = useState(false);

  const children_array = Children.toArray(props.children);

  const {
    rows,
    totalRows,
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
  } = useFetchTable(props.list_url, props.selectedStatus);

  // Notification logic
  const loadUnreadCount = async () => {
    const response = await getUnreadCount();
    if (response?.isSuccess) {
      setUnreadCount(response.data.payLoad || 0);
    }
  };

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    const response = await getNotifications();
    if (response?.isSuccess) {
      setNotifications(response.data.payLoad || []);
    }
    setLoadingNotifications(false);
  };

  const handleNotificationClick = async () => {
    await loadNotifications();
    const response = await markAllNotificationsAsRead();
    if (response?.isSuccess) {
      await loadNotifications();
      await loadUnreadCount();
    }
    setNotificationOpen(true);
  };

  // Handlers
  const handleEditClick = (id, row) => {
    handleOpenFormModal();
    setOperationType("edit");
    setRowID(id);
    setRowData(row || null);
  };

  const handleResubmitClick = (row) => {
    setResubmitApplication(row);
    setOpenResubmitDialog(true);
  };

  const handleSortClick = (attr) => () => {
    if (sortAttributeDirection.attr === attr) {
      if (sortAttributeDirection.direction === "asc") {
        setSortAttributeDirection({
          ...sortAttributeDirection,
          direction: "desc",
        });
        handleSortTable(attr, "asc");
      } else {
        setSortAttributeDirection({
          ...sortAttributeDirection,
          direction: "asc",
        });
        handleSortTable(attr, "desc");
      }
    } else {
      setSortAttributeDirection({
        attr: attr,
        direction: "asc",
      });
      handleSortTable(attr);
    }
  };

  const handleAddButtonClick = () => {
    handleOpenFormModal();
    setOperationType("insert");
  };

  const handleClearFilter = () => {
    handleResetTable();
    setClearAttributeFilter(true);
  };

  useEffect(() => {
    console.log("ROWWWWIDDD--->", rowID);
  }, [rowID]);

  useEffect(() => {
    loadUnreadCount();
  }, []);

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
          <Tooltip title="Notifications" placement="bottom">
            <IconButton color="primary" onClick={handleNotificationClick}>
              <Badge
                color="error"
                badgeContent={unreadCount}
                invisible={unreadCount === 0}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

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
        rowData: rowData,
        setRowData: setRowData,
        dropDownLists: props.dropDownLists,
        canSave: !props.disableAdd,
        tableColumns: props.tableColumns,
      })}

      {/* List */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "72vh" }}>
          {props.canList === false ? (
            <Box sx={{ p: 3 }}>
              <Typography>
                You do not have list permission for this module.
              </Typography>
            </Box>
          ) : (
            cloneElement(children_array[2], {
              handleResubmitClick: handleResubmitClick,
              rows: rows,
              api_url: props.api_url,
              tableColumns: props.tableColumns,
              alertString: props.alertString,
              handleEditClick: handleEditClick,
              handleForwardClick: props.handleForwardClick,
              handleApproveClick: props.handleApproveClick,
              handleRejectClick: props.handleRejectClick,
              handleRefreshTable: handleRefreshTable,
              sortAttributeDirection: sortAttributeDirection,
              setSortAttributeDirection: setSortAttributeDirection,
              handleSortClick: handleSortClick,
              canEdit: props.canEdit,
              canDelete: props.canDelete,
              dropDownLists: props.dropDownLists,
              handleScheduleInspection: props.handleScheduleInspection,
              handleUploadReport: props.handleUploadReport,
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
            </>
          ) : (
            <Box sx={{ paddingTop: 0.5 }}>0 to 0 of 0 Records</Box>
          )}
        </Stack>
      </Paper>

      {/* Notifications Dialog */}
      <Dialog
        open={notificationOpen}
        onClose={async () => {
          await markAllNotificationsAsRead();
          await loadNotifications();
          await loadUnreadCount();
          setNotificationOpen(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent dividers>
          {loadingNotifications ? (
            <Typography>Loading...</Typography>
          ) : notifications.length === 0 ? (
            <Typography>No notifications found.</Typography>
          ) : (
            notifications.map((notification) => (
              <Box
                key={notification.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  bgcolor: notification.isRead ? "#ffffff" : "#f5f9ff",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  if (!notification.isRead) {
                    await markNotificationAsRead(notification.id);
                    await loadNotifications();
                    await loadUnreadCount();
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {notification.title}
                </Typography>

                {notification.applicationNumber && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    <strong>Application No :</strong>{" "}
                    {notification.applicationNumber}
                  </Typography>
                )}

                {notification.district && (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    <strong>District :</strong> {notification.district}
                  </Typography>
                )}

                {notification.applicationStatus && (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    <strong>Status :</strong> {notification.applicationStatus}
                  </Typography>
                )}

                <Typography sx={{ mt: 1.5 }}>
                  {notification.message}
                </Typography>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              await markAllNotificationsAsRead();
              await loadNotifications();
              await loadUnreadCount();
              setNotificationOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingPercentageBackDrop open={isTableLoading} progress={progress} />

      {/* Resubmit Dialog */}
      <ResubmitDialog
        open={openResubmitDialog}
        application={resubmitApplication}
        onClose={() => {
          setOpenResubmitDialog(false);
          setResubmitApplication(null);
        }}
      />
    </Paper>
  );
};

DataTable.propTypes = {
  selectedStatus: PropTypes.string,
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
  handleScheduleInspection: PropTypes.func,
  handleUploadReport: PropTypes.func,
  handleApproveClick: PropTypes.func,
  handleRejectClick: PropTypes.func,
  extraParams: PropTypes.object,
};

export default DataTable;