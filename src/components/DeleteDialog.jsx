import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "material-react-toastify";
import { deleteItem } from "../api-client/apiCall";
const DeleteDialog = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (_, reason) => {
    if (reason && reason == "backdropClick") return;
    props.setID("");
    setOpen(false);
  };
  useEffect(() => {
    if (props.id) {
      handleOpen();
    }
  }, [props.id]);
  const handleSubmit = async () => {
    (async () => {
      const response = await deleteItem(`${props.api_url}delete/`, props.id);
      if (response.isSuccess) {
        props.handleRefreshTable();
        handleClose();
        toast.success(props.alertString + " Deleted Successfully");
      } else {
        toast.error(props.alertString + " Deletion Failed");
      }
    })();
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Are You Sure to Delete this {props.alertString} ??
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DeleteDialog.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  handleRefreshTable: PropTypes.func,
  id: PropTypes.string,
  setID: PropTypes.func,
};

export default DeleteDialog;
