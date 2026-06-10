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
  ROLE_MASTER_PATH,
  APPLICATION_STATUS_MASTER_PATH,
  PAYMENT_STATUS_MASTER_PATH,
  DISTRICT_PATH,
  FEE_SCHEDULE_PATH,
  OFFICE_PATH,
  TEST_PAGE_PATH,
  REGISTRATION_APPLICATION_PATH,
  DOCUMENT_TYPE_PATH,
  PAYMENT_TRANSACTION_PATH


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
import RoleMasterPage from "./pages/role_master";
import ApplicationStatusMasterPage from "./pages/application_status_master";
import PaymentStatusMasterPage from "./pages/payment_status_master";
import DistrictMasterPage from "./pages/district";
import FeeSchedulePage from "./pages/fee_schedule";
import OfficePage from "./pages/office";
import PermissionGate from "./components/PermissionGate";
import ProtectedRoute from "./ProtectedRoute";
import RegistrationApplicationPage from "./pages/registration_application";
import DocumentTypePage from "./pages/document_type";
import PaymentTransactionPage from "./pages/payment_transaction";

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
  const RegistrationApplicationPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: REGISTRATION_APPLICATION_PATH, action: "list" },
    createElement(RegistrationApplicationPage),
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
const RoleMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: ROLE_MASTER_PATH, action: "list" },
    createElement(RoleMasterPage),
  );
  const ApplicationStatusMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: APPLICATION_STATUS_MASTER_PATH, action: "list" },
    createElement(ApplicationStatusMasterPage),
  );
  const PaymentStatusMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: PAYMENT_STATUS_MASTER_PATH, action: "list" },
    createElement(PaymentStatusMasterPage),
  );
  const DistrictMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: DISTRICT_PATH, action: "list" },
    createElement(DistrictMasterPage),
  );
  const FeeSchedulePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: FEE_SCHEDULE_PATH, action: "list" },
    createElement(FeeSchedulePage),
  );
const OfficePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: OFFICE_PATH, action: "list" },
    createElement(OfficePage),
  );
  const DocumentTypePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: DOCUMENT_TYPE_PATH, action: "list" },
    createElement(DocumentTypePage)
  );
  const PaymentTransactionPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: PAYMENT_TRANSACTION_PATH, action: "list" },
    createElement(PaymentTransactionPage)
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
                path: ROLE_MASTER_PATH,
                Component: RoleMasterPageWithPermission
              },
              {
                path: APPLICATION_STATUS_MASTER_PATH,
                Component: ApplicationStatusMasterPageWithPermission
              },
              {
               path: PAYMENT_STATUS_MASTER_PATH,
                Component: PaymentStatusMasterPageWithPermission
              },
              {
                path: DISTRICT_PATH,
                Component: DistrictMasterPageWithPermission
              }, 
              {
                path: FEE_SCHEDULE_PATH,
                 Component: FeeSchedulePageWithPermission
              }, 
              {
                path: REGISTRATION_APPLICATION_PATH,
                Component: RegistrationApplicationPageWithPermission
              },
              {
                path: OFFICE_PATH,
                Component: OfficePageWithPermission
              },
              {
                   path: DOCUMENT_TYPE_PATH,
                  Component: DocumentTypePageWithPermission
            },
              {
                path: PAYMENT_TRANSACTION_PATH,
                Component: PaymentTransactionPageWithPermission
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
