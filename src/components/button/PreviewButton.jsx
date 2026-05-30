import PropTypes from "prop-types";
import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const PreviewButton = (props) => {
  return (
    <Tooltip title={"Documents"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="secondary"
        size="medium"
      >
        <RemoveRedEyeTwoToneIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

PreviewButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default PreviewButton;
