import PropTypes from "prop-types";
import HistoryIcon from "@mui/icons-material/History";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const HistoryButton = (props) => {
  return (
    <Tooltip title={"History"} placement="left">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="warning"
        size="medium"
      >
        <HistoryIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

HistoryButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default HistoryButton;
