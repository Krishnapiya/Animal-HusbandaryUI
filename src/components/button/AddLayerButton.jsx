import PropTypes from "prop-types";
import LibraryAddRoundedIcon from "@mui/icons-material/LibraryAddRounded";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const AddLayerButton = (props) => {
  return (
    <Tooltip title={"Add Layer"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="secondary"
        size="medium"
      >
        <LibraryAddRoundedIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

AddLayerButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default AddLayerButton;
