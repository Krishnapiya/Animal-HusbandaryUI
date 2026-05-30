import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import { PAYMENT_MODE_API_URL, PAYMENT_MODE_LIST_URL } from "../../config/endpoints";
import { PAYMENT_MODE_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const PaymentModePage = () => {
  const { can } = useAuthz();
  const { canList, canSave, canEdit, canDelete } = useCan(PAYMENT_MODE_PATH);
  const tableColumns = [
    { attr: "id", header: "ID" },
    { attr: "name", header: "Payment Mode Name" },
  ];

  return (
    <DataTable
      api_url={PAYMENT_MODE_API_URL}
      list_url={PAYMENT_MODE_LIST_URL}
      alertString="Payment Mode"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Payment Mode"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PAYMENT_MODE_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default PaymentModePage;

