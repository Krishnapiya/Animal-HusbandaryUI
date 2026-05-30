import { createBrowserRouter } from "react-router-dom";
import { createElement } from "react";
import App from "./App";
import MainLayout from "./components/Layout/MainLayout";
import {
  DESIGNATION_PATH,
  LOGIN_PATH,
  PAGE_NOT_FOUND_PATH,
  PAYMENT_MODE_PATH,
  RBAC_ADMIN_PATH,
  ROOT_PATH,
  SAMPLE_DEPARTMENT_PATH,
  STORE_ITEM_PATH,
  OFFICE_PATH,
  TEST_PAGE_PATH
} from "./config/routes";
import PageNotFound from "./pages/PageNotFound";
import ForbiddenPage from "./pages/ForbiddenPage";
import LoginPage from "./pages/LoginPage";
import PermissionedRbacAdmin from "./pages/rbac_admin/PermissionedRbacAdmin";
import TestPage from "./pages/test_page";
import SampleDepartmentPage from "./pages/sample_department";
import DesignationPage from "./pages/designation";
import PaymentModePage from "./pages/payment_mode";
import StoreItemPage from "./pages/store_item";
import OfficePage from "./pages/office";
import PermissionGate from "./components/PermissionGate";
import ProtectedRoute from "./ProtectedRoute";

const TestPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: TEST_PAGE_PATH, action: "list" },
    createElement(TestPage),
  );
const SampleDepartmentPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: SAMPLE_DEPARTMENT_PATH, action: "list" },
    createElement(SampleDepartmentPage),
  );
const DesignationPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: DESIGNATION_PATH, action: "list" },
    createElement(DesignationPage),
  );
const PaymentModePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: PAYMENT_MODE_PATH, action: "list" },
    createElement(PaymentModePage),
  );
const StoreItemPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: STORE_ITEM_PATH, action: "list" },
    createElement(StoreItemPage),
  );
const OfficePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: OFFICE_PATH, action: "list" },
    createElement(OfficePage),
  );
export const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: "/",
        Component: ProtectedRoute,

        children: [
          {
            path: "/",
            Component: MainLayout,
            children: [
              {
                path: ROOT_PATH,
                Component: TestPage
              },
              {
                path: TEST_PAGE_PATH,
                Component: TestPageWithPermission
              },
              {
                path: SAMPLE_DEPARTMENT_PATH,
                Component: SampleDepartmentPageWithPermission
              },
              {
                path: DESIGNATION_PATH,
                Component: DesignationPageWithPermission
              },
              {
                path: PAYMENT_MODE_PATH,
                Component: PaymentModePageWithPermission
              },
              {
                path: STORE_ITEM_PATH,
                Component: StoreItemPageWithPermission
              },
              {
                path: OFFICE_PATH,
                Component: OfficePageWithPermission
              },
              {
                path: RBAC_ADMIN_PATH,
                Component: PermissionedRbacAdmin
              },
              {
                path: "forbidden",
                Component: ForbiddenPage
              },
              {
                path: ":menuSlug",
                Component: PageNotFound
              },
              {
                path: PAGE_NOT_FOUND_PATH,
                Component: PageNotFound
              }
            ]
          }
        ]
      },
      { path: `/${LOGIN_PATH}`, Component: LoginPage }
    ]
  }
]);
