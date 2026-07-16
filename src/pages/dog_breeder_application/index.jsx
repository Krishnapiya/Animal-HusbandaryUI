import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Filter from "./Filter";
import Form from "./Form";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  DOG_BREEDER_APPLICATION_API_URL,
  DOG_BREEDER_APPLICATION_LIST_URL,
} from "../../config/endpoints";

import { DOG_BREEDER_APPLICATION_PATH } from "../../config/routes";

const DogBreederApplicationPage = () => {
  const { can } = useAuthz();

  const { canList } = useCan(DOG_BREEDER_APPLICATION_PATH);

  const tableColumns = [
    {
      attr: "applicationNumber",
      header: "Application Number",
    },
    {
      attr: "entityType",
      header: "Entity Type",
    },
    {
      attr: "applicationKind",
      header: "Application Kind",
    },
    {
      attr: "status",
      header: "Status",
      render: (row) => row.status?.name || row.statusId || "-",
    },
    {
      attr: "district",
      header: "District",
      render: (row) => row.district?.name || row.districtId || "-",
    },
  ];

  return (
    <DataTable
      api_url={DOG_BREEDER_APPLICATION_API_URL}
      list_url={DOG_BREEDER_APPLICATION_LIST_URL}
      alertString="Dog Breeder Application"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={true}
      pageTitle="Dog Breeder Registration List"
      canList={canList}
      canEdit={false}
      canDelete={false}
      canExport={can(DOG_BREEDER_APPLICATION_PATH, "export")}
    >
      <Filter />

      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default DogBreederApplicationPage;