import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import ScheduleInvestigationForm from "./ScheduleInvestigationForm";
import InvestigationActionForm from "./InvestigationActionForm";

import { uploadComplaintInspectionReport } from "../../api-client/citizenComplaint";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import axios from "axios";
import { useState } from "react";

import { getHeader } from "../../utils";

import { useAuthz } from "../../context/AuthzContext";

import {
  CITIZEN_COMPLAINT_API_URL,
  CITIZEN_COMPLAINT_LIST_URL,
} from "../../config/endpoints";

import {
  CITIZEN_COMPLAINT_FORWARDED_APPLICATION_PATH,
} from "../../config/routes";

import useCan from "../../hooks/useCan";

const CitizenComplaintForwardedApplicationPage = () => {

  // ---------------------------------------------------------
  // STATUS TAB
  // ---------------------------------------------------------

  const [selectedStatus, setSelectedStatus] = useState("");

  // ---------------------------------------------------------
  // INVESTIGATION DIALOG
  // ---------------------------------------------------------

  const [
    openInvestigationDialog,
    setOpenInvestigationDialog,
  ] = useState(false);

  const [
    selectedComplaintId,
    setSelectedComplaintId,
  ] = useState(null);

  const [
    investigationDialogMode,
    setInvestigationDialogMode,
  ] = useState("schedule");

  // ---------------------------------------------------------
  // AUTH / RBAC
  // ---------------------------------------------------------

  const { can } = useAuthz();

  const {
    canList,
    canSave,
    canEdit,
    canDelete,
  } = useCan(
    CITIZEN_COMPLAINT_FORWARDED_APPLICATION_PATH
  );

  // ---------------------------------------------------------
  // TABLE COLUMNS
  // ---------------------------------------------------------

  const tableColumns = [
    {
      attr: "complaintNumber",
      header: "Complaint No",
    },

    {
      attr: "petAnimalName",
      header: "Animal / Pet",
    },

    {
      attr: "placeOfIncident",
      header: "Place of Incident",
    },

    {
      attr: "incidentDate",
      header: "Incident Date",
    },

    {
      header: "Status",
      render: (row) =>
        row.status?.name ||
        row.status?.statusName ||
        row.status?.statusCode ||
        "-",
    },
  ];

  // ---------------------------------------------------------
  // START REVIEW
  // FORWARDED_TO_CVO → UNDER_REVIEW
  // ---------------------------------------------------------

  const handleStartReview = async (id) => {

    try {

      console.log("====================================");
      console.log("START REVIEW CLICKED");
      console.log("Complaint ID:", id);
      console.log("====================================");

      const baseUrl = (
        import.meta.env.VITE_APP_BASE_API_URL || ""
      ).replace(/\/+$/, "");

      const endpoint =
        CITIZEN_COMPLAINT_API_URL.replace(/^\/+/, "");

      const url =
        `${baseUrl}/${endpoint}/start-review/${id}`;

      console.log(
        "START REVIEW URL:",
        url
      );

      const response = await axios.patch(
        url,
        {},
        {
          headers: getHeader(),
        }
      );

      console.log(
        "START REVIEW SUCCESS:",
        response.data
      );

      window.location.reload();

    } catch (error) {

      console.error(
        "===================================="
      );

      console.error(
        "START REVIEW FAILED"
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Error:",
        error
      );

      console.error(
        "===================================="
      );
    }
  };

  // ---------------------------------------------------------
  // OPEN SCHEDULE INVESTIGATION
  // UNDER_REVIEW → INVESTIGATION_SCHEDULED
  // ---------------------------------------------------------

  const handleScheduleInvestigation = (id) => {

    console.log(
      "===================================="
    );

    console.log(
      "SCHEDULE INVESTIGATION CLICKED"
    );

    console.log(
      "Complaint ID:",
      id
    );

    console.log(
      "===================================="
    );

    setSelectedComplaintId(id);

    setInvestigationDialogMode("schedule");

    setOpenInvestigationDialog(true);
  };

  // ---------------------------------------------------------
  // CLOSE INVESTIGATION DIALOG
  // ---------------------------------------------------------

  const handleCloseInvestigationDialog = () => {

    setOpenInvestigationDialog(false);

    setSelectedComplaintId(null);

    setInvestigationDialogMode("schedule");
  };

  // ---------------------------------------------------------
  // SUBMIT INVESTIGATION
  // UNDER_REVIEW → INVESTIGATION_SCHEDULED
  // ---------------------------------------------------------

  const handleInvestigationSubmit = async (
    investigationData
  ) => {

    try {

      console.log(
        "===================================="
      );

      console.log(
        "SCHEDULE INVESTIGATION SUBMIT"
      );

      console.log(
        "Investigation Data:",
        investigationData
      );

      console.log(
        "===================================="
      );

      const baseUrl = (
        import.meta.env.VITE_APP_BASE_API_URL || ""
      ).replace(/\/+$/, "");

      const endpoint =
        CITIZEN_COMPLAINT_API_URL.replace(
          /^\/+/,
          ""
        );

      const url =
        `${baseUrl}/${endpoint}/schedule-investigation/${investigationData.complaintId}`;

      console.log(
        "SCHEDULE INVESTIGATION URL:",
        url
      );

      const requestBody = {
        investigationDate:
          investigationData.investigationDate,

        investigationRemarks:
          investigationData.investigationRemarks,
      };

      console.log(
        "SCHEDULE INVESTIGATION REQUEST BODY:",
        requestBody
      );

      const response = await axios.patch(
        url,
        requestBody,
        {
          headers: getHeader(),
        }
      );

      console.log(
        "SCHEDULE INVESTIGATION SUCCESS:",
        response.data
      );

      handleCloseInvestigationDialog();

      window.location.reload();

    } catch (error) {

      console.error(
        "===================================="
      );

      console.error(
        "SCHEDULE INVESTIGATION FAILED"
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Error:",
        error
      );

      console.error(
        "===================================="
      );
    }
  };

  // ---------------------------------------------------------
  // ACTION TAKEN
  // INVESTIGATION_SCHEDULED → ACTION_TAKEN
  // ---------------------------------------------------------

  const handleActionTaken = async (actionData) => {

    if (typeof actionData === "object" && actionData !== null) {
      const {
        complaintId,
        reportFile,
        remarks,
        recommendation,
      } = actionData;

      console.log("ACTION TAKEN complaintId:", complaintId);
      console.log("Report file:", reportFile);
      console.log("Remarks:", remarks);
      console.log("Recommendation:", recommendation);
      console.log("Uploading investigation report");

      try {
        const response = await uploadComplaintInspectionReport({
          complaintId,
          reportFile,
          remarks,
          recommendation,
        });

        console.log(
          "Investigation report upload successful",
          response
        );

        handleCloseInvestigationDialog();
        window.location.reload();
      } catch (error) {
        console.error(
          "Failed to upload complaint inspection report:",
          error
        );
      }

      return;
    }

    setSelectedComplaintId(actionData);

    setInvestigationDialogMode("action");

    setOpenInvestigationDialog(true);
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <>
      {/* =====================================================
          STATUS TABS
      ===================================================== */}

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
        }}
      >

        <Tabs
          value={selectedStatus}
          onChange={(e, value) =>
            setSelectedStatus(value)
          }
          variant="scrollable"
          scrollButtons="auto"
        >

          <Tab
            label="All"
            value=""
          />

          <Tab
            label="Forwarded to CVO"
            value="FORWARDED_TO_CVO"
          />

          <Tab
            label="Under Review"
            value="UNDER_REVIEW"
          />

          <Tab
            label="Investigation Scheduled"
            value="INVESTIGATION_SCHEDULED"
          />

          <Tab
            label="Verified by CVO"
            value="VERIFIED_BY_CVO"
          />

          <Tab
            label="Rejected by CVO"
            value="REJECTED_BY_CVO"
          />

        </Tabs>

      </Box>

      {/* =====================================================
          DATA TABLE
      ===================================================== */}

      <DataTable
        api_url={CITIZEN_COMPLAINT_API_URL}
        list_url={CITIZEN_COMPLAINT_LIST_URL}

        selectedStatus={selectedStatus}

        alertString="Citizen Complaint"

        tableColumns={tableColumns}

        includeFilter={canList}

        disableAdd={!canSave}

        pageTitle="Citizen Complaint"

        canList={canList}
        canEdit={canEdit}
        canDelete={canDelete}

        canExport={can(
          CITIZEN_COMPLAINT_FORWARDED_APPLICATION_PATH,
          "export"
        )}

        handleStartReview={
          handleStartReview
        }

        handleScheduleInvestigation={
          handleScheduleInvestigation
        }

        handleActionTaken={
          handleActionTaken
        }
      >

        {/* =================================================
            FILTER
        ================================================= */}

        <Filter />

        {/* =================================================
            VIEW COMPLAINT FORM
        ================================================= */}

        <FormDialog maxWidth="md">
          <Form />
        </FormDialog>

        {/* =================================================
            TABLE LIST
        ================================================= */}

        <List />

      </DataTable>

      {/* =====================================================
          INVESTIGATION DIALOG
      ===================================================== */}

      <Dialog
        open={openInvestigationDialog}
        onClose={
          handleCloseInvestigationDialog
        }
        maxWidth="sm"
        fullWidth
      >

        <DialogTitle>
          {investigationDialogMode === "action"
            ? "Upload Investigation Report"
            : "Schedule Investigation"}
        </DialogTitle>

        <DialogContent>

          {investigationDialogMode === "action" ? (

            <InvestigationActionForm
              complaintId={selectedComplaintId}
              onClose={
                handleCloseInvestigationDialog
              }
              onSubmit={
                handleActionTaken
              }
            />

          ) : (

            <ScheduleInvestigationForm
              complaintId={selectedComplaintId}
              onClose={
                handleCloseInvestigationDialog
              }
              onSubmit={
                handleInvestigationSubmit
              }
            />

          )}

        </DialogContent>

      </Dialog>

    </>
  );
};

export default CitizenComplaintForwardedApplicationPage;