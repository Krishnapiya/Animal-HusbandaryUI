import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import {
  FEE_SCHEDULE_API_URL,
  FEE_SCHEDULE_LIST_URL,
} from "../../config/endpoints";
import { FEE_SCHEDULE_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const FeeSchedulePage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(FEE_SCHEDULE_PATH);

  const tableColumns = [
    { attr: "entityType", header: "Entity Type" },
    { attr: "feeKind", header: "Fee Kind" },
    { attr: "amount", header: "Amount" },
    { attr: "currency", header: "Currency" },
    { attr: "effectiveFrom", header: "Effective From" },
    { attr: "effectiveTo", header: "Effective To" },
    { attr: "active", header: "Active" },
  ];

  return (
    <DataTable
      api_url={FEE_SCHEDULE_API_URL}
      list_url={FEE_SCHEDULE_LIST_URL}
      alertString="Fee Schedule"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Fee Schedule"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(FEE_SCHEDULE_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default FeeSchedulePage;