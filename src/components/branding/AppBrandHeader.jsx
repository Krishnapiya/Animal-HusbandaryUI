import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import {
  BRAND_ASSETS,
  BRAND_COLORS,
  BRAND_TEXT,
} from "../../config/branding";

const AppBrandHeader = ({
  title,
  subtitle,
  compact = false,
  align = "center",
}) => (
  <Box
    sx={{
      textAlign: align,
      mb: compact ? 2 : 3,
      fontFamily: "Arial, sans-serif",
    }}
  >
    <Box
      component="img"
      src={BRAND_ASSETS.keralaLogo}
      alt="Government of Kerala"
      sx={{
        width: compact ? 120 : 160,
        maxWidth: "100%",
        height: "auto",
        objectFit: "contain",
        mb: 2,
        mx: align === "center" ? "auto" : 0,
        display: "block",
      }}
    />

    <Typography
      variant="overline"
      sx={{
        display: "block",
        letterSpacing: 1.2,
        color: BRAND_COLORS.accent,
        fontWeight: 700,
        fontSize: compact ? "0.7rem" : "0.75rem",
      }}
    >
      {BRAND_TEXT.government}
    </Typography>

    <Typography
      variant={compact ? "h6" : "h5"}
      sx={{
        fontWeight: 700,
        color: BRAND_COLORS.primaryDarker,
        mt: 0.5,
        lineHeight: 1.3,
      }}
    >
      {BRAND_TEXT.department}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        color: BRAND_COLORS.greyDark,
        mt: 0.5,
        fontWeight: 600,
      }}
    >
      {BRAND_TEXT.board}
    </Typography>

    {title && (
      <Typography
        variant="subtitle1"
        sx={{
          color: BRAND_COLORS.primary,
          mt: 1.5,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
    )}

    {subtitle && (
      <Typography
        variant="body2"
        sx={{
          color: BRAND_COLORS.grey,
          mt: 0.5,
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

AppBrandHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  compact: PropTypes.bool,
  align: PropTypes.oneOf(["left", "center", "right"]),
};

export default AppBrandHeader;
