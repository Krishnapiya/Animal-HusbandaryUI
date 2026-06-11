import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";
import useDropDown from "../../hooks/useDropDown";

import {
  REGISTRATION_APPLICATION_API_URL,
  REGISTRATION_APPLICATION_LIST_URL,
  APPLICATION_STATUS_DROPDOWN_URL,
  DISTRICT_DROPDOWN_URL,
  OFFICE_DROPDOWN_URL,
} from "../../config/endpoints";

import { REGISTRATION_APPLICATION_PATH } from "../../config/routes";

const RegistrationApplicationPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(REGISTRATION_APPLICATION_PATH);

  const dropDownLists = useDropDown([
    {
      api_url: APPLICATION_STATUS_DROPDOWN_URL,
      includeToken: true,
      dropdown: "status",
    },
    {
      api_url: DISTRICT_DROPDOWN_URL,
      includeToken: true,
      dropdown: "district",
    },
    {
      api_url: OFFICE_DROPDOWN_URL,
      includeToken: true,
      dropdown: "assignedOffice",
    },
    {
      api_url: OFFICE_DROPDOWN_URL,
      includeToken: true,
      dropdown: "cvOffice",
    },
  ]);

  const tableColumns = [
    {
      attr: "applicationNumber",
      header: "Application Number",
    },
    {
      attr: "entityType",
      header: "Entity Type",
    },
    {
      attr: "applicationKind",
      header: "Application Kind",
    },
    {
      attr: "status",
      header: "Status",
      render: (row) => row.status?.name || row.statusId || "-",
    },
    {
      attr: "district",
      header: "District",
      render: (row) => row.district?.name || row.districtId || "-",
    },
  ];

  return (
    <DataTable
      api_url={REGISTRATION_APPLICATION_API_URL}
      list_url={REGISTRATION_APPLICATION_LIST_URL}
      alertString="Registration Application"
      tableColumns={tableColumns}
      dropDownLists={dropDownLists}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Registration Application"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(REGISTRATION_APPLICATION_PATH, "export")}
    >
      <Filter dropDownLists={dropDownLists} />

      <FormDialog maxWidth="md">
        <Form dropDownLists={dropDownLists} />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default RegistrationApplicationPage;