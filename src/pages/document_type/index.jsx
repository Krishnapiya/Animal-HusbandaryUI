import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  DOCUMENT_TYPE_API_URL,
  DOCUMENT_TYPE_LIST_URL,
} from "../../config/endpoints";

import { DOCUMENT_TYPE_PATH } from "../../config/routes";

const DocumentTypePage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(DOCUMENT_TYPE_PATH);

  const tableColumns = [
    { attr: "code", header: "Code" },
    { attr: "name", header: "Name" },
    { attr: "entityScope", header: "Entity Scope" },
    { attr: "mandatory", header: "Mandatory" },
    { attr: "active", header: "Active" },
  ];

  return (
    <DataTable
      api_url={DOCUMENT_TYPE_API_URL}
      list_url={DOCUMENT_TYPE_LIST_URL}
      alertString="Document Type"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Document Type Master"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(DOCUMENT_TYPE_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default DocumentTypePage;