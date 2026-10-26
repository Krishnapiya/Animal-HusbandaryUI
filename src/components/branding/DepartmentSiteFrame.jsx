import PropTypes from "prop-types";
import { Box, CssBaseline, Typography } from "@mui/material";
import { BRAND_ASSETS, BRAND_TEXT } from "../../config/branding";

export const SITE = {
  cream: "#f7f3ec",
  teal: "#0c3c4c",
  tealDark: "#082f3b",
  green: "#1f7a3a",
  greenDark: "#166030",
  ink: "#1c2b24",
  muted: "#5c6b63",
  line: "#e4ddd2",
};

const DepartmentSiteFrame = ({ children }) => (
  <Box sx={{ minHeight: "100vh", bgcolor: SITE.cream, color: SITE.ink }}>
    <CssBaseline />

    <Box
      sx={{
        bgcolor: "#fff",
        textAlign: "center",
        py: 0.75,
        borderBottom: `1px solid ${SITE.line}`,
        fontSize: 13,
        letterSpacing: 0.2,
      }}
    >
      {BRAND_TEXT.government}
    </Box>

    <Box sx={{ bgcolor: "#fff", borderBottom: `1px solid ${SITE.line}` }}>
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          component="img"
          src={BRAND_ASSETS.keralaLogo}
          alt="Government of Kerala"
          sx={{ width: { xs: 56, sm: 72 }, height: "auto" }}
        />
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 15, sm: 20 },
              fontWeight: 800,
              letterSpacing: 0.4,
              lineHeight: 1.15,
              color: SITE.ink,
              textTransform: "uppercase",
            }}
          >
            Kerala State Animal Husbandry Department
          </Typography>
          <Typography sx={{ fontSize: 13, color: SITE.muted, mt: 0.25 }}>
            {BRAND_TEXT.government}
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{ bgcolor: SITE.teal, color: "#fff" }}>
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: 1.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          {BRAND_TEXT.portalTitle}
        </Typography>
        <Typography sx={{ fontSize: 13, opacity: 0.9, display: { xs: "none", sm: "block" } }}>
          {BRAND_TEXT.board}
        </Typography>
      </Box>
    </Box>

    {children}
  </Box>
);

DepartmentSiteFrame.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DepartmentSiteFrame;
