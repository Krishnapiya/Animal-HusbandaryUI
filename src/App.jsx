import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router-dom";
//import { themeConfig } from "./theme";
import logo from "./assets/logo.png";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import { useAuthz } from "./context/AuthzContext";
const BRANDING = {
  title: (
    <Box sx={{ color: "white", display: { xs: "none", md: "inline" } }}>
      Keltron Admin LTE
    </Box>
  ),
  logo: <img src={logo} style={{ width: "100%" }} />,
};

export default function App() {
  //const theme = themeConfig();
  const { navigation } = useAuthz();
  return (
    <ReactRouterAppProvider
      navigation={navigation}
      branding={BRANDING}
      //theme={theme}
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
