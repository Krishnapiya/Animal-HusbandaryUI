import PropTypes from "prop-types";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const AddButton = (props) => {
  return (
    <Tooltip title={`Add ${props.title}`} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="success"
        size="large"
      >
        <AddCircleRoundedIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

AddButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default AddButton;
