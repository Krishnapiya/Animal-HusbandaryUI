import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Filter from "./Filter";
import List from "./List";
import Form from "./Form";

import {
  DOG_BREEDER_MY_APPLICATION_API_URL,
  DOG_BREEDER_MY_APPLICATION_LIST_URL,
} from "../../config/endpoints";

const DogBreederMyApplicationPage = () => {
  const tableColumns = [
    {
      attr: "applicationNumber",
      header: "Application No",
    },
    {
      header: "Breeder Name",
      render: (row) => row.breederName || row.dogBreederDetail?.breederName || "-",
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
      api_url={DOG_BREEDER_MY_APPLICATION_API_URL}
      list_url={DOG_BREEDER_MY_APPLICATION_LIST_URL}
      alertString="My Applications"
      pageTitle="My Applications"
      tableColumns={tableColumns}
      includeFilter={true}
      disableAdd={true}
      canList={true}
      canEdit={true}
      canDelete={false}
    >
      <Filter />

      {/* 
        Pass title="View Application Details" so the dialog header updates.
        FormDialog automatically passes `onClose` and `rowID` down to <Form />
      */}
      <FormDialog maxWidth="md" title="View Application Details">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default DogBreederMyApplicationPage;