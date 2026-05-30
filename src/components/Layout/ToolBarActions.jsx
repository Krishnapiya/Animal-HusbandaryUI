import Stack from "@mui/material/Stack";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import UserMenu from "./UserMenu";
import UserTitle from "../accounts/UserTitle";
import ModuleTopBar from "./ModuleTopBar";

const ToolBarActions = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%", minWidth: 0 }}>
      <ModuleTopBar />
      <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
        <ThemeSwitcher />
        <UserTitle />
        <UserMenu />
      </Stack>
    </Stack>
  );
};

export default ToolBarActions;
