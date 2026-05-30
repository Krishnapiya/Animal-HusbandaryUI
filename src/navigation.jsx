import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { TEST_PAGE_PATH } from "./config/routes";
export const NAVIGATION = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />
  },
  {
    segment: TEST_PAGE_PATH,
    title: "User Registration",
    icon: <AppRegistrationIcon />
  }
];
