import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  PET_SHOP_MY_APPLICATION_API_URL,
  PET_SHOP_MY_APPLICATION_LIST_URL,
} from "../../config/endpoints";

import { PET_SHOP_MY_APPLICATION_PATH } from "../../config/routes";

const PetShopMyApplicationsPage = () => {

  const { can } = useAuthz();

  const {
    canList,
    canSave,
    canEdit,
    canDelete,
  } = useCan(PET_SHOP_MY_APPLICATION_PATH);

  const tableColumns = [
    {
      attr: "applicationNumber",
      header: "Application No",
    },
    {
      attr: "shopName",
      header: "Pet Shop Name",
    },
    {
      header: "District",
      render: (row) => row.district?.name || "-",
    },
    {
      header: "Status",
      render: (row) => row.status?.name || "-",
    },
  ];

  return (
    <DataTable
        api_url={PET_SHOP_MY_APPLICATION_API_URL}
  list_url={PET_SHOP_MY_APPLICATION_LIST_URL}
      alertString="My Applications"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="My Applications"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PET_SHOP_MY_APPLICATION_PATH, "export")}
    >
      <Filter />

      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default PetShopMyApplicationsPage;