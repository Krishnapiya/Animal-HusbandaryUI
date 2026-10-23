import { useState } from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import ComplaintDetailsForm from "../citizen_complaint_forwarded_application/Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import axios from "axios";
import { toast } from "material-react-toastify";

import { getHeader } from "../../utils";

import {
  CITIZEN_COMPLAINT_API_URL,
  CITIZEN_COMPLAINT_LIST_URL,
} from "../../config/endpoints";
import {
  approveComplaintApplication,
  rejectComplaintApplication,
} from "../../api-client/citizenComplaint";

// Change this later if your project already has a route constant
const CITIZEN_COMPLAINT_APPLICATION_PATH =
  "/citizen-complaint-application";

const CitizenComplaintApplicationPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("");

  const { can } = useAuthz();

  const {
    canList,
    canSave,
    canEdit,
    canDelete,
  } = useCan(CITIZEN_COMPLAINT_APPLICATION_PATH);

  /**
   * Admin forwards complaint to CVO.
   *
   * IMPORTANT:
   * We are following the same pattern as Pet Shop:
   *
   * PATCH
   * /citizen/auth/complaint-registration/forward/{id}
   *
   * If your backend uses a different endpoint,
   * we will change this after checking the backend.
   */
  const handleForwardClick = async (id) => {
    try {
      const baseUrl = String(
        import.meta.env.VITE_APP_BASE_API_URL || ""
      ).replace(/\/+$/, "");

      const endpoint =
        `${CITIZEN_COMPLAINT_API_URL.replace(/^\/+/, "")}` +
        `forward/${id}`;

      const url = `${baseUrl}/${endpoint}`;

      console.log("Citizen complaint forward URL:", url);
      console.log("Complaint ID:", id);

      await axios.patch(
        url,
        {},
        {
          headers: getHeader(),
        }
      );

      toast.success("Complaint forwarded to CVO successfully");

      window.location.reload();
    } catch (error) {
      console.error(
        "Failed to forward citizen complaint:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Complaint forwarding failed"
      );
    }
  };

  const handleApproveClick = async (id) => {
    try {
      await approveComplaintApplication(id);
      toast.success("Complaint approved successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to approve citizen complaint:", error);
      toast.error(
        error?.response?.data?.message ||
          "Complaint approval failed"
      );
    }
  };

  const handleRejectClick = async (id) => {
    try {
      await rejectComplaintApplication(id);
      toast.success("Complaint rejected successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to reject citizen complaint:", error);
      toast.error(
        error?.response?.data?.message ||
          "Complaint rejection failed"
      );
    }
  };

  const tableColumns = [
    {
      attr: "complaintNumber",
      header: "Complaint No",
    },

    {
      attr: "citizenName",
      header: "Citizen",
    },

    {
      attr: "placeOfIncident",
      header: "Place",
    },

    {
      attr: "incidentDate",
      header: "Incident Date",
    },

    {
      header: "Status",
      render: (row) =>
        row?.status?.name ||
        row?.status?.statusName ||
        row?.status?.statusCode ||
        row?.statusName ||
        row?.statusCode ||
        "-",
    },
  ];

  return (
    <>
      {/* STATUS TABS */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
        }}
      >
        <Tabs
          value={selectedStatus}
          onChange={(event, value) =>
            setSelectedStatus(value)
          }
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" value="" />

          <Tab
            label="Submitted"
            value="SUBMITTED"
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
            label="Approved"
            value="APPLICATION_APPROVED"
          />

          <Tab
            label="Rejected"
            value="APPLICATION_REJECTED"
          />
        </Tabs>
      </Box>

      {/* MAIN DATA TABLE */}
      <DataTable
        api_url={CITIZEN_COMPLAINT_API_URL}
        list_url={CITIZEN_COMPLAINT_LIST_URL}
        selectedStatus={selectedStatus}
        handleForwardClick={handleForwardClick}
        handleApproveClick={handleApproveClick}
        handleRejectClick={handleRejectClick}
        alertString="Citizen Complaint"
        tableColumns={tableColumns}
        includeFilter={canList}
        disableAdd={!canSave}
        pageTitle="Citizen Complaint"
        canList={canList}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={can(
          CITIZEN_COMPLAINT_APPLICATION_PATH,
          "export"
        )}
      >
        <Filter />

        <FormDialog maxWidth="lg" title="Citizen Complaint Details">
          <ComplaintDetailsForm />
        </FormDialog>

        <List />
      </DataTable>
    </>
  );
};

export default CitizenComplaintApplicationPage;