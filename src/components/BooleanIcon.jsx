import PropTypes from "prop-types";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
const BooleanIcon = (props) => {
  return props.value ? (
    <CheckCircleRoundedIcon color="success" />
  ) : (
    <CancelRoundedIcon color="error" />
  );
};

BooleanIcon.propTypes = {
  value: PropTypes.bool,
};

export default BooleanIcon;
