import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";

import {
  APPLICATION_CORRECTION_API_URL,
  APPLICATION_CORRECTION_LIST_URL,
} from "../../config/endpoints";

import { APPLICATION_CORRECTION_PATH } from "../../config/routes";

import useCan from "../../hooks/useCan";

const ApplicationCorrectionPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(APPLICATION_CORRECTION_PATH);

  const tableColumns = [
    {
      attr: "applicationId",
      header: "Application ID",
    },
    {
      attr: "correctionSummary",
      header: "Correction Summary",
    },
    {
      attr: "submittedByName",
      header: "Submitted By",
    },
  ];

  return (
    <DataTable
      api_url={APPLICATION_CORRECTION_API_URL}
      list_url={APPLICATION_CORRECTION_LIST_URL}
      alertString="Application Correction"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Application Correction"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(APPLICATION_CORRECTION_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default ApplicationCorrectionPage;