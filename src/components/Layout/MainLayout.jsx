import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet } from "react-router-dom";
import SideBarFooter from "./SideBarFooter";
import ToolBarActions from "./ToolBarActions";
export default function MainLayout() {
  return (
    <DashboardLayout
      slots={{
        toolbarActions: ToolBarActions,
        sidebarFooter: SideBarFooter
      }}
      sidebarExpandedWidth={220}
      sx={{
        header: (theme) => ({
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(90eg, #333333, #555555)" // Dark mode gradient
              : "linear-gradient(90deg, #3b0a79, #2575fc)", // Light mode gradientlinear-gradient(135deg, #6a11cb 0%, #2575fc 100%)
          ".MuiIconButton-root": {
            color: theme.palette.mode === "dark" ? "grey.300" : "#fff"
          }
        })
      }}
    >
      <PageContainer breadcrumbs={[]} maxWidth title="">
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
