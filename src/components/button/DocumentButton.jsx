import PropTypes from "prop-types";
import DescriptionIcon from "@mui/icons-material/Description";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const DocumentButton = (props) => {
  return (
    <Tooltip title={"Documents"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="secondary"
        size="medium"
      >
        <DescriptionIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

DocumentButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DocumentButton;
