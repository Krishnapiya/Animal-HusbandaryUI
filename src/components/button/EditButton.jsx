import PropTypes from "prop-types";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const EditButton = (props) => {
  return (
    <Tooltip title="Edit" placement="left">
      <IconButton
        color="success"
        onClick={props.onClick}
        disabled={props.is_disabled}
        size="small"
      >
        <EditNoteTwoToneIcon />
      </IconButton>
    </Tooltip>
  );
};

EditButton.propTypes = {
  onClick: PropTypes.func,
  is_disabled: PropTypes.bool,
};

export default EditButton;
