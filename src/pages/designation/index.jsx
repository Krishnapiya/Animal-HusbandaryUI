import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import { DESIGNATION_API_URL, DESIGNATION_LIST_URL } from "../../config/endpoints";
import { DESIGNATION_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const DesignationPage = () => {
  const { can } = useAuthz();
  const { canList, canSave, canEdit, canDelete } = useCan(DESIGNATION_PATH);
  const tableColumns = [
    { attr: "id", header: "ID" },
    { attr: "name", header: "Designation Name" },
  ];

  return (
    <DataTable
      api_url={DESIGNATION_API_URL}
      list_url={DESIGNATION_LIST_URL}
      alertString="Designation"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Designation"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(DESIGNATION_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default DesignationPage;

