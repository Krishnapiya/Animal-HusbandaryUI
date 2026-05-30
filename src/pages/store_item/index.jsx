import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import { STORE_ITEM_API_URL, STORE_ITEM_LIST_URL } from "../../config/endpoints";
import { STORE_ITEM_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const StoreItemPage = () => {
  const { can } = useAuthz();
  const { canList, canSave, canEdit, canDelete } = useCan(STORE_ITEM_PATH);
  const tableColumns = [
    { attr: "id", header: "ID" },
    { attr: "name", header: "Item name" },
  ];

  return (
    <DataTable
      api_url={STORE_ITEM_API_URL}
      list_url={STORE_ITEM_LIST_URL}
      alertString="Store item"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Store items"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(STORE_ITEM_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default StoreItemPage;
