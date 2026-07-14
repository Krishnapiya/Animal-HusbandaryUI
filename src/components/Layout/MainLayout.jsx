import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet } from "react-router-dom";
import SideBarFooter from "./SideBarFooter";
import ToolBarActions from "./ToolBarActions";
import { BRAND_GRADIENTS } from "../../config/branding";

export default function MainLayout() {
  return (
    <DashboardLayout
      slots={{
        toolbarActions: ToolBarActions,
        sidebarFooter: SideBarFooter,
      }}
      sidebarExpandedWidth={240}
      sx={{
        fontFamily: "Arial, sans-serif",
        header: (theme) => ({
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(90deg, #111827, #1f2937)"
              : BRAND_GRADIENTS.header,
          ".MuiIconButton-root": {
            color: theme.palette.mode === "dark" ? "grey.300" : "#fff",
          },
        }),
      }}
    >
      <PageContainer breadcrumbs={[]} maxWidth title="">
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
