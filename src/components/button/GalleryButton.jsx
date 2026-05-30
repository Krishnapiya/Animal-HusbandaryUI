import PropTypes from "prop-types";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const GalleryButton = (props) => {
  return (
    <Tooltip title={"View Images"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="warning"
        size="medium"
      >
        <PermMediaIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

GalleryButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default GalleryButton;
