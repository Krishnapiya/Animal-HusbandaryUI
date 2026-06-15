import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  DOG_BREEDER_DETAIL_API_URL,
  DOG_BREEDER_DETAIL_LIST_URL,
} from "../../config/endpoints";

import { DOG_BREEDER_DETAIL_PATH } from "../../config/routes";

const DogBreederDetailPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(DOG_BREEDER_DETAIL_PATH);

  const tableColumns = [
    {
      attr: "breederName",
      header: "Breeder Name",
    },
    {
      attr: "city",
      header: "City",
    },
    {
      attr: "contactMobile",
      header: "Mobile",
    },
    {
      attr: "totalDogsCount",
      header: "Dogs Count",
    },
  ];

  return (
    <DataTable
      api_url={DOG_BREEDER_DETAIL_API_URL}
      list_url={DOG_BREEDER_DETAIL_LIST_URL}
      alertString="Dog Breeder Detail"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Dog Breeder Detail"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(DOG_BREEDER_DETAIL_PATH, "export")}
    >
      <Filter />

      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default DogBreederDetailPage;