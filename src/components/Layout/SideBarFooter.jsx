import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { BRAND_TEXT } from "../../config/branding";

const SideBarFooter = ({ mini }) => {
  return (
    <Box sx={{ m: 1 }}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          whiteSpace: mini ? "nowrap" : "normal",
          overflow: "hidden",
          color: "text.secondary",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.4,
        }}
      >
        {!mini && BRAND_TEXT.footer}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 0.5,
          color: "text.secondary",
          fontFamily: "Arial, sans-serif",
        }}
      >
        © {new Date().getFullYear()}
        {!mini && " Keltron"}
      </Typography>
    </Box>
  );
};

SideBarFooter.propTypes = {
  mini: PropTypes.any,
};

export default SideBarFooter;
