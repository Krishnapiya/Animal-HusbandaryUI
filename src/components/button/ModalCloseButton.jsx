import PropTypes from "prop-types";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const ModalCloseButton = (props) => {
  return (
    <Tooltip title={"Close"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="error"
        size={props.size || "large"}
        sx={props.sx}
      >
        <CancelIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

ModalCloseButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  sx: PropTypes.any,
};

export default ModalCloseButton;
