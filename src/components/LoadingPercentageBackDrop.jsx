import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";
const LoadingPercentageBackDrop = (props) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props.open}
    >
      <CircularProgressWithLabel value={props.progress} />
    </Backdrop>
  );
};

LoadingPercentageBackDrop.propTypes = {
  open: PropTypes.bool,
  progress: PropTypes.number,
};

export default LoadingPercentageBackDrop;
