import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import {
  APPLICATION_WORKFLOW_API_URL,
  APPLICATION_WORKFLOW_LIST_URL,
} from "../../config/endpoints";

const ApplicationWorkflowPage = () => {
  const tableColumns = [
    {
      attr: "moduleName",
      header: "Module",
    },
    {
      attr: "applicationId",
      header: "Application ID",
    },
    {
      attr: "actionBy",
      header: "Action By",
    },
    {
      attr: "remarks",
      header: "Remarks",
    },
    {
  attr: "actionDate",
  header: "Action Date",
  render: (row) => {
    if (!row.actionDate) return "";

    return new Date(row.actionDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },

}
  ];

  return (
    <DataTable
      api_url={APPLICATION_WORKFLOW_API_URL}
      list_url={APPLICATION_WORKFLOW_LIST_URL}
      alertString="Application Workflow"
      tableColumns={tableColumns}
      includeFilter={true}
      pageTitle="Application Workflow"
      canList={true}
      canEdit={true}
      canDelete={true}
      canExport={true}
    >
      <Filter />
      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default ApplicationWorkflowPage;