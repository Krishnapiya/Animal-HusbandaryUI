import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import {
  PET_SHOP_DETAIL_API_URL,
  PET_SHOP_DETAIL_LIST_URL,
} from "../../config/endpoints";
import { PET_SHOP_DETAIL_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const PetShopDetailPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(PET_SHOP_DETAIL_PATH);

  const tableColumns = [
    { attr: "shopName", header: "Shop Name" },
    { attr: "ownerName", header: "Owner Name" },
    { attr: "city", header: "City" },
    { attr: "contactMobile", header: "Mobile" },
  ];

  return (
    <DataTable
      api_url={PET_SHOP_DETAIL_API_URL}
      list_url={PET_SHOP_DETAIL_LIST_URL}
      alertString="Pet Shop Detail"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Pet Shop Detail"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PET_SHOP_DETAIL_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default PetShopDetailPage;