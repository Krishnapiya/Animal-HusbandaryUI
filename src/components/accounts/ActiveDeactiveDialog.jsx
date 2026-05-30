import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "material-react-toastify";
import { deleteItem } from "../../api-client/apiCall";
const ActiveDeactiveDialog = (props) => {
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
      const response = await deleteItem(props.api_url, props.id);
      if (response.isSuccess) {
        props.handleRefreshTable();
        handleClose();
        if (response.data.is_active)
          toast.success(props.alertString + " Activated Successfully");
        else toast.success(props.alertString + " Deactivated Successfully");
      } else {
        toast.error(response.data.detail);
      }
    })();
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are You Sure to Continue ??</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ActiveDeactiveDialog.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  handleRefreshTable: PropTypes.func,
  id: PropTypes.string,
  setID: PropTypes.func,
};

export default ActiveDeactiveDialog;
