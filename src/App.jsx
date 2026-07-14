import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router-dom";
import { themeConfig } from "./theme";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuthz } from "./context/AuthzContext";
import { BRAND_TEXT, BRAND_ASSETS } from "./config/branding";

const BRANDING = {
  title: (
    <Box sx={{ color: "white", display: { xs: "none", md: "block" } }}>
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: "0.95rem",
          fontWeight: 700,
          lineHeight: 1.2,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {BRAND_TEXT.department}
      </Typography>
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: "0.72rem",
          fontWeight: 500,
          opacity: 0.9,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {BRAND_TEXT.board}
      </Typography>
    </Box>
  ),
  logo: (
    <Box
      component="img"
      src={BRAND_ASSETS.keralaLogo}
      alt="Government of Kerala"
      sx={{
        width: 40,
        height: 40,
        objectFit: "contain",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 1,
        p: 0.5,
      }}
    />
  ),
};

export default function App() {
  const theme = themeConfig();
  const { navigation } = useAuthz();
  return (
    <ReactRouterAppProvider
      navigation={navigation}
      branding={BRANDING}
      theme={theme}
    >
      <Outlet />
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ReactRouterAppProvider>
  );
}
