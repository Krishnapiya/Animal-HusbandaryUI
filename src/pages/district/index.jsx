import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import {
  DISTRICT_API_URL,
  DISTRICT_LIST_URL,
} from "../../config/endpoints";
import { DISTRICT_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const DistrictMasterPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(DISTRICT_PATH);

  const tableColumns = [
    { attr: "code", header: "District Code" },
    { attr: "name", header: "District Name" },
    { attr: "active", header: "Active" },
  ];

  return (
    <DataTable
      api_url={DISTRICT_API_URL}
      list_url={DISTRICT_LIST_URL}
      alertString="District"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="District"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(DISTRICT_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default DistrictMasterPage;