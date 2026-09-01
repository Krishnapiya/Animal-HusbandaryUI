import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { scheduleInspection ,uploadInspectionReport, } from "../../api-client/petShopRegistration";
import UploadInspectionReportForm from "./UploadInspectionReportForm";
import { useAuthz } from "../../context/AuthzContext";
import {
  PET_SHOP_REGISTRATION_APPLICATION_API_URL,
  PET_SHOP_FORWARDED_APPLICATION_LIST_URL,
} from "../../config/endpoints";
import {
  PET_SHOP_FORWARDED_APPLICATION_PATH,
} from "../../config/routes";
import useCan from "../../hooks/useCan";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ScheduleInspectionForm from "./ScheduleInspectionForm";

const PetShopApplicationPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const { can } = useAuthz();
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
const [selectedApplicationId, setSelectedApplicationId] = useState(null);
const [openReportDialog, setOpenReportDialog] = useState(false);
const [selectedReportApplicationId, setSelectedReportApplicationId] =
  useState(null);

const handleScheduleInspection = (id) => {
  setSelectedApplicationId(id);
  setOpenScheduleDialog(true);
};

const handleCloseScheduleDialog = () => {
  setOpenScheduleDialog(false);
  setSelectedApplicationId(null);
};
const handleInspectionSubmit = async (inspectionData) => {
  try {
    await scheduleInspection({
      applicationId: inspectionData.applicationId,
      inspectionDate: inspectionData.inspectionDate,
      inspectionRemarks: inspectionData.remarks,
    });

    handleCloseScheduleDialog();

    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};
const handleUploadReport = (id) => {
  setSelectedReportApplicationId(id);
  setOpenReportDialog(true);
};

const handleCloseReportDialog = () => {
  setOpenReportDialog(false);
  setSelectedReportApplicationId(null);
};

const handleReportSubmit = async (reportData) => {
  try {
    await uploadInspectionReport({
      applicationId: reportData.applicationId,
      reportFile: reportData.reportFile,
      remarks: reportData.remarks,
      recommendation: reportData.recommendation,
    });

    handleCloseReportDialog();

    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};

const {
  canList,
  canSave,
  canEdit,
  canDelete,
} = useCan(PET_SHOP_FORWARDED_APPLICATION_PATH);

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
  </Tabs>
</Box>
    <DataTable
      api_url={PET_SHOP_REGISTRATION_APPLICATION_API_URL}
      list_url={PET_SHOP_FORWARDED_APPLICATION_LIST_URL}
      selectedStatus={selectedStatus}
      alertString="Pet Shop Registration"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Pet Shop Registration"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PET_SHOP_FORWARDED_APPLICATION_PATH, "export")}
      handleScheduleInspection={handleScheduleInspection}
handleUploadReport={handleUploadReport}
    >
      <Filter />

      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>

      <List />
    </DataTable>

    <Dialog
      open={openScheduleDialog}
      onClose={handleCloseScheduleDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Schedule Inspection</DialogTitle>
<ScheduleInspectionForm
  applicationId={selectedApplicationId}
  onClose={handleCloseScheduleDialog}
  onSubmit={handleInspectionSubmit}
/>
    </Dialog>
    <Dialog
  open={openReportDialog}
  onClose={handleCloseReportDialog}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    Upload Inspection Report
  </DialogTitle>

  <UploadInspectionReportForm
    applicationId={selectedReportApplicationId}
    onClose={handleCloseReportDialog}
    onSubmit={handleReportSubmit}
  />
</Dialog>
  </>
);
};

export default PetShopApplicationPage;