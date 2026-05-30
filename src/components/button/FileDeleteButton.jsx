import PropTypes from "prop-types";
import Delete from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const FileDeleteButton = (props) => {
  return (
    <Tooltip title={"Delete File"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="error"
        size="medium"
      >
        <Delete fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

FileDeleteButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default FileDeleteButton;
