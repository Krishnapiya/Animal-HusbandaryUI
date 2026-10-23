import { useLocation } from "react-router-dom";

import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Filter from "./Filter";
import Form from "./Form";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  CITIZEN_COMPLAINT_API_URL,
  CITIZEN_COMPLAINT_LIST_URL,
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
  const { pathname } = useLocation();
  const menuKey = menuKeyForPath(pathname);

  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } = useCan(menuKey);

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
    <DataTable
      api_url={CITIZEN_COMPLAINT_API_URL}
      list_url={CITIZEN_COMPLAINT_LIST_URL}
      alertString="Citizen Complaint"
      tableColumns={tableColumns}
      includeFilter={true}
      pageTitle="Citizen Complaint Registration"
      canList={canList}
      canAdd={canSave}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(menuKey, "export")}
    >
      <Filter />

      <FormDialog maxWidth="lg">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default CitizenComplaintRegistrationPage;