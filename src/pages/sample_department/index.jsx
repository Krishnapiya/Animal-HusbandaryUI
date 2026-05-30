import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import {
  SAMPLE_DEPARTMENT_API_URL,
  SAMPLE_DEPARTMENT_LIST_URL,
} from "../../config/endpoints";
import { SAMPLE_DEPARTMENT_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const SampleDepartmentPage = () => {
  const { can } = useAuthz();
  const { canList, canSave, canEdit, canDelete } = useCan(SAMPLE_DEPARTMENT_PATH);
  const tableColumns = [
    { attr: "id", header: "ID" },
    { attr: "name", header: "Department Name" },
  ];

  return (
    <DataTable
      api_url={SAMPLE_DEPARTMENT_API_URL}
      list_url={SAMPLE_DEPARTMENT_LIST_URL}
      alertString="Sample Department"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Sample Department"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(SAMPLE_DEPARTMENT_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default SampleDepartmentPage;

