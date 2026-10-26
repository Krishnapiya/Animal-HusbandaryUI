import { useState } from "react";
import { useLocation } from "react-router-dom";

import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Filter from "./Filter";
import Form from "./Form";
import List from "./List";
import ComplaintDetailsForm from "../citizen_complaint_forwarded_application/Form";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  CITIZEN_COMPLAINT_API_URL,
  CITIZEN_COMPLAINT_MY_LIST_URL,
} from "../../config/endpoints";

import {
  CITIZEN_COMPLAINT_APPLICATION_PATH,
  CITIZEN_COMPLAINT_FORWARDED_PATH,
  CITIZEN_COMPLAINT_REGISTRATION_PATH,
} from "../../config/routes";

const menuKeyForPath = (pathname) => {
  const path = String(pathname || "").toLowerCase();

  if (path.includes(CITIZEN_COMPLAINT_FORWARDED_PATH)) {
    return CITIZEN_COMPLAINT_FORWARDED_PATH;
  }

  if (path.includes(CITIZEN_COMPLAINT_APPLICATION_PATH)) {
    return CITIZEN_COMPLAINT_APPLICATION_PATH;
  }

  return CITIZEN_COMPLAINT_REGISTRATION_PATH;
};

const CitizenComplaintRegistrationPage = () => {
  const [viewComplaintId, setViewComplaintId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { pathname } = useLocation();
  const menuKey = menuKeyForPath(pathname);

  const { can } = useAuthz();

  const { canList, canAdd, canSave, canEdit, canDelete } = useCan(menuKey);

  const handleViewClick = (id) => {
    setViewComplaintId(id);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewComplaintId(null);
  };

  const tableColumns = [
    {
      attr: "complaintNumber",
      header: "Complaint Number",
    },
    {
      attr: "placeOfIncident",
      header: "Place of Incident",
    },
    {
      attr: "petAnimalName",
      header: "Pet / Animal Name",
    },
    {
      attr: "incidentDate",
      header: "Incident Date",
    },
    {
      attr: "status",
      header: "Status",
    },
  ];

  return (
    <>
      <DataTable
        api_url={CITIZEN_COMPLAINT_API_URL}
        list_url={CITIZEN_COMPLAINT_MY_LIST_URL}
        alertString="Citizen Complaint"
        tableColumns={tableColumns}
        includeFilter={true}
        pageTitle="Citizen Complaint Registration"
        canList={canList}
        canAdd={canAdd ?? canSave}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={can(menuKey, "export")}
        handleViewClick={handleViewClick}
      >
        <Filter />

        <FormDialog maxWidth="lg">
          <Form />
        </FormDialog>

        <List />
      </DataTable>

      <FormDialog
        maxWidth="lg"
        open={viewDialogOpen}
        handleCloseFormModal={handleCloseViewDialog}
        title="Complaint Details"
        rowID={viewComplaintId}
      >
        <ComplaintDetailsForm
          rowID={viewComplaintId}
          onClose={handleCloseViewDialog}
        />
      </FormDialog>
    </>
  );
};

export default CitizenComplaintRegistrationPage;
