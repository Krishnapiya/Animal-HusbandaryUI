import PropTypes from "prop-types";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const DeleteButton = (props) => {
  return (
    <Tooltip title={"Delete File"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="error"
        size="medium"
      >
        <DeleteForeverTwoToneIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

DeleteButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DeleteButton;
