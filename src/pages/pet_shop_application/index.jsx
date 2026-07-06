import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import {
  PET_SHOP_REGISTRATION_APPLICATION_API_URL,
  PET_SHOP_REGISTRATION_APPLICATION_LIST_URL,
} from "../../config/endpoints";
import { PET_SHOP_APPLICATION_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const PetShopApplicationPage = () => {
  const { can } = useAuthz();

  const {
    canList,
    canSave,
    canEdit,
    canDelete,
  } = useCan(PET_SHOP_APPLICATION_PATH);

  const tableColumns = [
  { attr: "applicationNumber", header: "Application No" },

  { attr: "entityType", header: "Entity Type" },

  { attr: "applicationKind", header: "Application Type" },

  {
    header: "Status",
    render: (row) => row.status?.name || "-",
  },

  {
    header: "District",
    render: (row) => row.district?.name || "-",
  },
];

  return (
    <DataTable
      api_url={PET_SHOP_REGISTRATION_APPLICATION_API_URL}
      list_url={PET_SHOP_REGISTRATION_APPLICATION_LIST_URL}
      alertString="Pet Shop Registration"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Pet Shop Registration"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PET_SHOP_APPLICATION_PATH, "export")}
    >
      <Filter />

      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default PetShopApplicationPage;