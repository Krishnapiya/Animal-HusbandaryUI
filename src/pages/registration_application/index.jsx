import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  REGISTRATION_APPLICATION_API_URL,
  REGISTRATION_APPLICATION_LIST_URL,
} from "../../config/endpoints";

import { REGISTRATION_APPLICATION_PATH } from "../../config/routes";

const RegistrationApplicationPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(REGISTRATION_APPLICATION_PATH);

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
      attr: "statusId",
      header: "Status",
    },
    {
      attr: "districtId",
      header: "District",
    },
  ];

  return (
    <DataTable
      api_url={REGISTRATION_APPLICATION_API_URL}
      list_url={REGISTRATION_APPLICATION_LIST_URL}
      alertString="Registration Application"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Registration Application"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(
        REGISTRATION_APPLICATION_PATH,
        "export"
      )}
    >
      <Filter />
      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default RegistrationApplicationPage;
