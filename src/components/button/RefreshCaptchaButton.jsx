import PropTypes from "prop-types";
import CachedSharpIcon from "@mui/icons-material/CachedSharp";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
const RefreshCaptchaButton = (props) => {
  return (
    <Tooltip title={"Refresh Captcha"} placement="right">
      <IconButton
        onClick={props.onClick}
        disabled={props.is_disabled}
        color="secondary"
        size="medium"
      >
        <CachedSharpIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

RefreshCaptchaButton.propTypes = {
  is_disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default RefreshCaptchaButton;
