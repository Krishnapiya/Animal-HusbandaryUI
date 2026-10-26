import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
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
const [listRefreshKey, setListRefreshKey] = useState(0);
const [rejectTargetId, setRejectTargetId] = useState(null);
const [rejectRemarks, setRejectRemarks] = useState("");
const [isRejecting, setIsRejecting] = useState(false);
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
const handleRejectClick = (id) => {
  setRejectTargetId(id);
  setRejectRemarks("");
};

const handleCloseRejectDialog = () => {
  if (isRejecting) {
    return;
  }

  setRejectTargetId(null);
  setRejectRemarks("");
};

const handleRejectSubmit = async () => {
  const rejectionReason = rejectRemarks.trim();

  if (!rejectionReason) {
    toast.error("Please enter the reason for rejection");
    return;
  }

  try {
    setIsRejecting(true);

    const response = await rejectApplication(
      rejectTargetId,
      rejectionReason
    );

    if (!response?.isSuccess) {
      toast.error(
        response?.data?.message ||
          response?.data?.detail ||
          "Rejection failed"
      );
      return;
    }

    toast.success("Application rejected");
    setRejectTargetId(null);
    setRejectRemarks("");
    setListRefreshKey((current) => current + 1);
  } catch (error) {
    console.error(error);
    toast.error("Rejection failed");
  } finally {
    setIsRejecting(false);
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
      refreshKey={listRefreshKey}

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

      <FormDialog maxWidth="lg" title="Pet Shop Application Details">
        <Form />
      </FormDialog>

      <List />
    </DataTable>

    <Dialog
      open={Boolean(rejectTargetId)}
      onClose={handleCloseRejectDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Reject Application</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          required
          multiline
          minRows={4}
          margin="dense"
          label="Reason for rejection"
          value={rejectRemarks}
          onChange={(event) => setRejectRemarks(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseRejectDialog} disabled={isRejecting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleRejectSubmit}
          disabled={isRejecting || !rejectRemarks.trim()}
        >
          {isRejecting ? "Rejecting..." : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
  
};

export default PetShopApplicationPage;