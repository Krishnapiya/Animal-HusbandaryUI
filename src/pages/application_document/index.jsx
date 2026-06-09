import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import useDropDown from "../../hooks/useDropDown";
import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  APPLICATION_DOCUMENT_API_URL,
  APPLICATION_DOCUMENT_LIST_URL,
  USER_DROPDOWN_URL,
  DOCUMENT_TYPE_DROPDOWN_URL,
  REGISTRATION_APPLICATION_DROPDOWN_URL,
} from "../../config/endpoints";

import { APPLICATION_DOCUMENT_PATH } from "../../config/routes";

const ApplicationDocumentPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(APPLICATION_DOCUMENT_PATH);

  const dropDownLists = useDropDown([
    {
      api_url: USER_DROPDOWN_URL,
      includeToken: true,
      dropdown: "uploadedBy",
    },
    {
      api_url: DOCUMENT_TYPE_DROPDOWN_URL,
      includeToken: true,
      dropdown: "documentTypeId",
    },
    {
      api_url: REGISTRATION_APPLICATION_DROPDOWN_URL,
      includeToken: true,
      dropdown: "applicationId",
    },
  ]);

  const tableColumns = [
    { attr: "fileName", header: "File Name" },
    { attr: "mimeType", header: "Mime Type" },
    { attr: "fileSizeBytes", header: "File Size Bytes" },

    {
      attr: "uploadedByName",
      header: "Uploaded By",
      render: (row) => row.uploadedByName || row.uploadedBy || "-",
    },

    {
      attr: "documentTypeName",
      header: "Document Type",
      render: (row) => row.documentTypeName || row.documentTypeId || "-",
    },

    {
      attr: "applicationNumber",
      header: "Application",
      render: (row) => row.applicationNumber || row.applicationId || "-",
    },

    { attr: "uploadedAt", header: "Uploaded At" },
  ];

  return (
    <DataTable
      api_url={APPLICATION_DOCUMENT_API_URL}
      list_url={APPLICATION_DOCUMENT_LIST_URL}
      alertString="Application Document"
      tableColumns={tableColumns}
      includeFilter={canList}
      dropDownLists={dropDownLists}
      disableAdd={!canSave}
      pageTitle="Application Document"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(APPLICATION_DOCUMENT_PATH, "export")}
    >
      <Filter dropDownLists={dropDownLists} />

      <FormDialog maxWidth="md">
        <Form dropDownLists={dropDownLists} />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default ApplicationDocumentPage;