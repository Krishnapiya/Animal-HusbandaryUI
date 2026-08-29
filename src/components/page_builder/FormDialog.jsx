import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ModalCloseButton from "../button/ModalCloseButton";
import { Children, cloneElement } from "react";
const FormDialog = (props) => {
  const children_array = Children.toArray(props.children);

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        fullScreen={props.fullScreen || false}
        maxWidth={props.maxWidth || "sm"}
        fullWidth
        sx={{ zIndex: 1201 }}
      >
        <DialogTitle>
          {/*eslint-disable*/}
          {props.title
            ? props.title
            : `${
                props.operationType == "insert"
                  ? "Add "
                  : props.operationType == "edit"
                    ? "Edit "
                    : ""
              } ${props.alertString}`}
          <ModalCloseButton
            onClick={props.handleCloseFormModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          />
        </DialogTitle>
        <DialogContent>
          {/* Form */}
          {cloneElement(children_array[0], {
            api_url: props.api_url,
            operationType: props.operationType,
            rowID: props.rowID,
            rowData: props.rowData,
            setRowID: props.setRowID,
            handleCloseFormModal: props.handleCloseFormModal,
            handleRefreshTable: props.handleRefreshTable,
            alertString: props.alertString,
            dropDownLists: props.dropDownLists,
            tableColumns: props.tableColumns,
            canSave: props.canSave,
          })}
        </DialogContent>
      </Dialog>
    </div>
  );
};

FormDialog.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  children: PropTypes.any,
  dropDownLists: PropTypes.any,
  fullScreen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleCloseFormModal: PropTypes.func,
  handleOpen: PropTypes.func,
  handleRefreshTable: PropTypes.func,
  maxWidth: PropTypes.string,
  open: PropTypes.bool,
  operationType: PropTypes.string,
  rowID: PropTypes.string,
  rowData: PropTypes.object,
  setOperationType: PropTypes.func,
  setRowID: PropTypes.func,
  setRowData: PropTypes.func,
  tableColumns: PropTypes.array,
  canSave: PropTypes.bool,
  title: PropTypes.string,
};

export default FormDialog;
