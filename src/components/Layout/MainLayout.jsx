import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarFooter from "./SideBarFooter";
import ToolBarActions from "./ToolBarActions";
import { BRAND_GRADIENTS } from "../../config/branding";

export default function MainLayout() {
  // Toolpad accepts a sidebar width but does not provide a resize control. Keep
  // it in component state so the navigation can be widened for longer labels.
  const [sidebarWidth, setSidebarWidth] = useState(320);

  const resizeSidebar = useCallback((event) => {
    const maxWidth = Math.min(520, window.innerWidth - 320);
    setSidebarWidth(Math.max(240, Math.min(event.clientX, maxWidth)));
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener("pointermove", resizeSidebar);
    window.removeEventListener("pointerup", stopResizing);
  }, [resizeSidebar]);

  const startResizing = useCallback(
    (event) => {
      event.preventDefault();
      window.addEventListener("pointermove", resizeSidebar);
      window.addEventListener("pointerup", stopResizing, { once: true });
    },
    [resizeSidebar, stopResizing],
  );

  useEffect(() => stopResizing, [stopResizing]);

  return (
    <DashboardLayout
      slots={{
        toolbarActions: ToolBarActions,
        sidebarFooter: SideBarFooter,
      }}
      sidebarExpandedWidth={sidebarWidth}
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
      <Box
        aria-label="Resize navigation"
        onPointerDown={startResizing}
        role="separator"
        aria-orientation="vertical"
        sx={{
          display: { xs: "none", md: "block" },
          position: "fixed",
          top: 64,
          bottom: 0,
          left: sidebarWidth - 4,
          width: 8,
          cursor: "col-resize",
          zIndex: (theme) => theme.zIndex.drawer + 2,
          touchAction: "none",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 3,
            width: 2,
            backgroundColor: "transparent",
          },
          "&:hover::after": {
            backgroundColor: "primary.main",
          },
        }}
      />
      <PageContainer breadcrumbs={[]} maxWidth title="">
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
