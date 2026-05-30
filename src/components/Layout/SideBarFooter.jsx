import PropTypes from "prop-types";
import { Typography } from "@mui/material";
const SideBarFooter = ({ mini }) => {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
    >
      {!mini && `© ${new Date().getFullYear()} DEVELOPED BY KELTRON`}
    </Typography>
  );
};

SideBarFooter.propTypes = {
  mini: PropTypes.any,
};

export default SideBarFooter;
