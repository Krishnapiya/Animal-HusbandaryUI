import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
const ListButton = (props) => {
  return (
    <Tooltip title="details" placement="left">
      <IconButton
        color="info"
        onClick={props.onClick}
        disabled={props.is_disabled}
        size="small"
        cursor="pointer"
      >
        <AppRegistrationIcon />
      </IconButton>
    </Tooltip>
  );
};

ListButton.propTypes = {
  onClick: PropTypes.func,
  is_disabled: PropTypes.bool,
};

export default ListButton;
