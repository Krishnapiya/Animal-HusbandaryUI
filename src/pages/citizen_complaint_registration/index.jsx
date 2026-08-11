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
  CITIZEN_COMPLAINT_REGISTRATION_PATH,
} from "../../config/routes";

const CitizenComplaintRegistrationPage = () => {

  const { can } = useAuthz();

  const { canList, canAdd, canEdit, canDelete } =
    useCan(CITIZEN_COMPLAINT_REGISTRATION_PATH);

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
      canAdd={canAdd}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(
        CITIZEN_COMPLAINT_REGISTRATION_PATH,
        "export"
      )}
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