import PropTypes from "prop-types";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import {
  BRAND_ASSETS,
  BRAND_COLORS,
  BRAND_GRADIENTS,
  BRAND_TEXT,
} from "../../config/branding";

const AuthSplitLayout = ({ children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "Arial, sans-serif",
      background: BRAND_GRADIENTS.pageBackground,
    }}
  >
    <Grid container sx={{ minHeight: "100vh", width: "100%" }}>
      <Grid
        size={{ xs: 12, md: 6, lg: 7 }}
        sx={{
          display: { xs: "none", md: "flex" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${BRAND_ASSETS.loginHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(30,58,138,0.82) 0%, rgba(13,110,58,0.88) 100%)",
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            color: BRAND_COLORS.white,
            p: { md: 4, lg: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            component="img"
            src={BRAND_ASSETS.keralaLogo}
            alt="Government of Kerala"
            sx={{
              width: 200,
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
              mb: 3,
              filter: "brightness(0) invert(1)",
            }}
          />

          <Typography
            variant="overline"
            sx={{
              letterSpacing: 1.2,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {BRAND_TEXT.government}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mt: 1,
              lineHeight: 1.25,
            }}
          >
            {BRAND_TEXT.department}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 1,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {BRAND_TEXT.board}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {BRAND_TEXT.portalTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Pet shop registration, dog breeder registration, and departmental
            services for Kerala Animal Welfare Board.
          </Typography>

          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              maxWidth: 520,
            }}
          >
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2.5,
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.8,
                fontSize: "0.95rem",
              }}
            >
              <li>Online FORM-1 pet shop registration</li>
              <li>Dog breeder licence application</li>
              <li>Document upload and application tracking</li>
              <li>Departmental user and office workflows</li>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6, lg: 5 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 520 }}>{children}</Box>
      </Grid>
    </Grid>
  </Box>
);

AuthSplitLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthSplitLayout;
