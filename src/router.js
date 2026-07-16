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
  APPLICATION_DOCUMENT_PATH,
  REGISTRATION_APPLICATION_PATH,
  DOCUMENT_TYPE_PATH,
  PET_SHOP_DETAIL_PATH,
  PET_SHOP_REGISTER_PATH,
  PET_SHOP_OWNER_SIGNUP_PATH,
  APPLICATION_WORKFLOW_PATH,
  PAYMENT_TRANSACTION_PATH,
  DOG_BREEDER_BREED_PATH,
  APPLICATION_CORRECTION_PATH,
  DOG_BREEDER_DETAIL_PATH,
  DOG_BREEDER_REGISTER_PATH,
  DOG_BREEDER_APPLICATION_PATH,
  ANIMAL_SPECIES_PATH,
  PET_SHOP_APPLICATION_PATH,
   PET_SHOP_FORWARDED_APPLICATION_PATH,
   PET_SHOP_MY_APPLICATION_PATH,
} from "./config/routes";

import PetShopMyApplicationPage from "./pages/pet_shop_my_applications";
import PetShopForwardedApplicationPage from "./pages/pet_shop_forwarded_application";
import PetShopApplicationPage from "./pages/pet_shop_application";
import DogBreederRegisterPage from "./pages/dog_breeder_register";
import DogBreederApplicationPage from "./pages/dog_breeder_application";
import AnimalSpeciesMasterPage from "./pages/animal_species";
import ApplicationWorkflowPage from "./pages/application_workflow";
import DogBreederDetailPage from "./pages/dog_breeder_detail";
import ApplicationCorrectionPage from "./pages/application_correction";
import PetShopDetailPage from "./pages/pet_shop_detail";
import PageNotFound from "./pages/PageNotFound";
import ForbiddenPage from "./pages/ForbiddenPage";
import LoginPage from "./pages/LoginPage";
import PetShopOwnerRegisterPage from "./pages/PetShopOwnerRegisterPage";
import PetShopRegisterPage from "./pages/pet_shop_register";
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
import ApplicationDocumentPage from "./pages/application_document";
import RegistrationApplicationPage from "./pages/registration_application";
import DocumentTypePage from "./pages/document_type";
import DogBreederBreedPage from "./pages/dog_breeder_breed";
import PaymentTransactionPage from "./pages/payment_transaction";

const PetShopMyApplicationPageWithPermission = () =>
  createElement(
    PermissionGate,
    {
      menuKey: PET_SHOP_MY_APPLICATION_PATH,
      action: "list",
    },
    createElement(PetShopMyApplicationPage)
  );
const PetShopForwardedApplicationPageWithPermission = () =>
  createElement(
    PermissionGate,
    {
      menuKey: PET_SHOP_FORWARDED_APPLICATION_PATH,
      action: "list",
    },
    createElement(PetShopForwardedApplicationPage)
  );
const PetShopApplicationPageWithPermission = () =>
  createElement(
    PermissionGate,
    {
      menuKey: PET_SHOP_APPLICATION_PATH,
      action: "list",
    },
    createElement(PetShopApplicationPage)
  );
const AnimalSpeciesPageWithPermission = () =>
  createElement(
    PermissionGate,
    {
      menuKey: ANIMAL_SPECIES_PATH,
      action: "list",
    },
    createElement(AnimalSpeciesMasterPage)
  );
const ApplicationCorrectionPageWithPermission = () =>
  createElement(
    PermissionGate,
    {
      menuKey: APPLICATION_CORRECTION_PATH,
      action: "list",
    },
    createElement(ApplicationCorrectionPage)
  );

const DogBreederDetailPageWithPermission = () =>
  createElement(
    PermissionGate,
    {
      menuKey: DOG_BREEDER_DETAIL_PATH,
      action: "list",
    },
    createElement(DogBreederDetailPage)
  );

const ApplicationWorkflowPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: APPLICATION_WORKFLOW_PATH, action: "list" },
    createElement(ApplicationWorkflowPage)
  );

const PetShopRegisterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: "pet-shop-register", action: "save" },
    createElement(PetShopRegisterPage)
  );

const PetShopDetailPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: PET_SHOP_DETAIL_PATH, action: "list" },
    createElement(PetShopDetailPage)
  );

const TestPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: TEST_PAGE_PATH, action: "list" },
    createElement(TestPage)
  );

const SampleDepartmentPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: SAMPLE_DEPARTMENT_PATH, action: "list" },
    createElement(SampleDepartmentPage)
  );

const RegistrationApplicationPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: REGISTRATION_APPLICATION_PATH, action: "list" },
    createElement(RegistrationApplicationPage)
  );

const DesignationPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: DESIGNATION_PATH, action: "list" },
    createElement(DesignationPage)
  );

const PaymentModePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: PAYMENT_MODE_PATH, action: "list" },
    createElement(PaymentModePage)
  );

const StoreItemPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: STORE_ITEM_PATH, action: "list" },
    createElement(StoreItemPage)
  );

const RoleMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: ROLE_MASTER_PATH, action: "list" },
    createElement(RoleMasterPage)
  );

const ApplicationStatusMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: APPLICATION_STATUS_MASTER_PATH, action: "list" },
    createElement(ApplicationStatusMasterPage)
  );

const PaymentStatusMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: PAYMENT_STATUS_MASTER_PATH, action: "list" },
    createElement(PaymentStatusMasterPage)
  );

const DistrictMasterPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: DISTRICT_PATH, action: "list" },
    createElement(DistrictMasterPage)
  );

const FeeSchedulePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: FEE_SCHEDULE_PATH, action: "list" },
    createElement(FeeSchedulePage)
  );

const OfficePageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: OFFICE_PATH, action: "list" },
    createElement(OfficePage)
  );

const ApplicationDocumentPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: APPLICATION_DOCUMENT_PATH, action: "list" },
    createElement(ApplicationDocumentPage)
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

const DogBreederBreedPageWithPermission = () =>
  createElement(
    PermissionGate,
    { menuKey: DOG_BREEDER_BREED_PATH, action: "list" },
    createElement(DogBreederBreedPage)
  );

const DogBreederRegisterPageWithPermission = () =>
  createElement(DogBreederRegisterPage);

const DogBreederApplicationPageWithPermission = () =>
  createElement(
    PermissionGate,
    {
      menuKey: DOG_BREEDER_APPLICATION_PATH,
      action: "list",
    },
    createElement(DogBreederApplicationPage)
  );

export const router = createBrowserRouter([
  {
    Component: App,
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
                Component: TestPage,
              },
              {
                path: ANIMAL_SPECIES_PATH,
                Component: AnimalSpeciesPageWithPermission
              },
              {
                path: PET_SHOP_MY_APPLICATION_PATH,
                Component: PetShopMyApplicationPageWithPermission,
              },
              {
                path: PET_SHOP_REGISTER_PATH,
                Component: PetShopRegisterPageWithPermission,
              },
              {
                path: PET_SHOP_DETAIL_PATH,
                Component: PetShopDetailPageWithPermission,
              },
              {
                path: APPLICATION_CORRECTION_PATH,
                Component: ApplicationCorrectionPageWithPermission,
              },
              {
                path: DOG_BREEDER_DETAIL_PATH,
                Component: DogBreederDetailPageWithPermission,
              },
              {
                path: TEST_PAGE_PATH,
                Component: TestPageWithPermission,
              },
              {
                path: PET_SHOP_FORWARDED_APPLICATION_PATH,
                Component: PetShopForwardedApplicationPageWithPermission,
              },
              {

              path: APPLICATION_WORKFLOW_PATH,
              Component: ApplicationWorkflowPageWithPermission,
              },
              {
              path: PET_SHOP_APPLICATION_PATH,
              Component: PetShopApplicationPageWithPermission,
              },
              {
                path: SAMPLE_DEPARTMENT_PATH,
                Component: SampleDepartmentPageWithPermission,
              },
              {
                path: DESIGNATION_PATH,
                Component: DesignationPageWithPermission,
              },
              {
                path: PAYMENT_MODE_PATH,
                Component: PaymentModePageWithPermission,
              },
              {
                path: STORE_ITEM_PATH,
                Component: StoreItemPageWithPermission,
              },
              {
                path: ROLE_MASTER_PATH,
                Component: RoleMasterPageWithPermission,
              },
              {
                path: APPLICATION_STATUS_MASTER_PATH,
                Component: ApplicationStatusMasterPageWithPermission,
              },
              {
                path: PAYMENT_STATUS_MASTER_PATH,
                Component: PaymentStatusMasterPageWithPermission,
              },
              {
                path: DISTRICT_PATH,
                Component: DistrictMasterPageWithPermission,
              },
              {
                path: FEE_SCHEDULE_PATH,
                Component: FeeSchedulePageWithPermission,
              },
              {
                path: REGISTRATION_APPLICATION_PATH,
                Component: RegistrationApplicationPageWithPermission,
              },
              {
                path: OFFICE_PATH,
                Component: OfficePageWithPermission,
              },
              {
                path: DOCUMENT_TYPE_PATH,
                Component: DocumentTypePageWithPermission,
              },
              {
                path: PAYMENT_TRANSACTION_PATH,
                Component: PaymentTransactionPageWithPermission,
              },
              {
                path: RBAC_ADMIN_PATH,
                Component: PermissionedRbacAdmin,
              },
              {
                path: DOG_BREEDER_REGISTER_PATH,
                Component: DogBreederRegisterPageWithPermission,
              },
              {
                path: APPLICATION_DOCUMENT_PATH,
                Component: ApplicationDocumentPageWithPermission,
              },
              {
                path: DOG_BREEDER_BREED_PATH,
                Component: DogBreederBreedPageWithPermission,
              },
              {
                path: DOG_BREEDER_APPLICATION_PATH,
                Component: DogBreederApplicationPageWithPermission,
              },
             
              {
                path: "forbidden",
                Component: ForbiddenPage,
              },
              {
                path: ":menuSlug",
                Component: PageNotFound,
              },
              {
                path: PAGE_NOT_FOUND_PATH,
                Component: PageNotFound,
              },
            ],
          },
        ],
      },
      {
        path: `/${LOGIN_PATH}`,
        Component: LoginPage,
      },
      {
        path: `/${PET_SHOP_OWNER_SIGNUP_PATH}`,
        Component: PetShopOwnerRegisterPage,
      },
    ],
  },
]);