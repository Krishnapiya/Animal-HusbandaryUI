import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  PET_SHOP_MY_APPLICATION_API_URL,
  PET_SHOP_MY_APPLICATION_LIST_URL,
} from "../../config/endpoints";

import { PET_SHOP_MY_APPLICATION_PATH } from "../../config/routes";

const PetShopMyApplicationsPage = () => {
const [selectedStatus, setSelectedStatus] = useState("");
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
    <>
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
  <Tabs
    value={selectedStatus}
    onChange={(e, value) => setSelectedStatus(value)}
    variant="scrollable"
    scrollButtons="auto"
  >
    <Tab label="All" value="" />

    <Tab label="Draft" value="DRAFT" />

    <Tab label="Submitted" value="SUBMITTED" />

    <Tab label="Approved" value="APPLICATION_APPROVED" />

    <Tab label="Rejected" value="APPLICATION_REJECTED" />
  </Tabs>
</Box>
    <DataTable
        api_url={PET_SHOP_MY_APPLICATION_API_URL}
  list_url={PET_SHOP_MY_APPLICATION_LIST_URL}
 selectedStatus={selectedStatus}
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

      <FormDialog maxWidth="xl">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
    </>
  );
  
};

export default PetShopMyApplicationsPage;