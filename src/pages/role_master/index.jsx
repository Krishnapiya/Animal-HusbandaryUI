import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import { ROLE_MASTER_API_URL, ROLE_MASTER_LIST_URL } from "../../config/endpoints";
import { ROLE_MASTER_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const RoleMasterPage = () => {
  const { can } = useAuthz();
  const { canList, canSave, canEdit, canDelete } = useCan(ROLE_MASTER_PATH);
  const tableColumns = [{ attr: "roleName", header: "Role Name" }];

  return (
    <DataTable
      api_url={ROLE_MASTER_API_URL}
      list_url={ROLE_MASTER_LIST_URL}
      alertString="Role Master"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Role Master"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(ROLE_MASTER_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default RoleMasterPage;
