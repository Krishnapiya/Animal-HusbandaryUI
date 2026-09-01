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
import {
  PET_SHOP_REGISTRATION_APPLICATION_API_URL,
  PET_SHOP_REGISTRATION_APPLICATION_LIST_URL,
} from "../../config/endpoints";
import { PET_SHOP_APPLICATION_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";
import axios from "axios";
import { toast } from "material-react-toastify";
import { getHeader } from "../../utils";
import {
  approveApplication,
  rejectApplication,
} from "../../api-client/petShopRegistration";
const PetShopApplicationPage = () => {
const [selectedStatus, setSelectedStatus] = useState("");
  const handleForwardClick = async (id) => {
  try {
    const baseUrl = import.meta.env.VITE_APP_BASE_API_URL.replace(/\/$/, "");
const endpoint = `${PET_SHOP_REGISTRATION_APPLICATION_API_URL.replace(/^\/+/, "")}forward/${id}`;

await axios.patch(
  `${baseUrl}/${endpoint}`,
  {},                     // request body
  {
    headers: getHeader(), // request headers
  }
);

    toast.success("Application forwarded successfully");

    window.location.reload();
  } catch (error) {
    console.error(error);
    toast.error("Forward failed");
  }
};
const handleApproveClick = async (id) => {
  try {
    await approveApplication(id);

    toast.success("Application approved successfully");

    window.location.reload();
  } catch (error) {
    console.error(error);
    toast.error("Approval failed");
  }
};
const handleRejectClick = async (id) => {
  try {
    await rejectApplication(id);

    toast.success("Application rejected successfully");

    window.location.reload();
  } catch (error) {
    console.error(error);
    toast.error("Rejection failed");
  }
};
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
  <>
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs
        value={selectedStatus}
        onChange={(e, value) => setSelectedStatus(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All" value="" />

        <Tab label="Submitted" value="SUBMITTED" />

        <Tab
          label="Forwarded to CVO"
          value="FORWARDED_TO_CVO"
        />

        <Tab
          label="Inspection Scheduled"
          value="INSPECTION_SCHEDULED"
        />

        <Tab
          label="Verified by CVO"
          value="VERIFIED_BY_CVO"
        />

        <Tab
          label="Rejected by CVO"
          value="REJECTED_BY_CVO"
        />

        <Tab
          label="Resubmitted"
          value="RESUBMITTED"
        />

        <Tab
          label="Approved"
          value="APPLICATION_APPROVED"
        />

        <Tab
          label="Rejected"
          value="APPLICATION_REJECTED"
        />
      </Tabs>
    </Box>

    <DataTable
      api_url={PET_SHOP_REGISTRATION_APPLICATION_API_URL}
      list_url={PET_SHOP_REGISTRATION_APPLICATION_LIST_URL}

selectedStatus={selectedStatus}

      handleForwardClick={handleForwardClick}
      alertString="Pet Shop Registration"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Pet Shop Registration"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PET_SHOP_APPLICATION_PATH, "export")}
      handleApproveClick={handleApproveClick}
handleRejectClick={handleRejectClick}
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

export default PetShopApplicationPage;