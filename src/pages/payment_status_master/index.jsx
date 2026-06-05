import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  PAYMENT_STATUS_MASTER_API_URL,
  PAYMENT_STATUS_MASTER_LIST_URL,
} from "../../config/endpoints";

import { PAYMENT_STATUS_MASTER_PATH } from "../../config/routes";

const PaymentStatusMasterPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(PAYMENT_STATUS_MASTER_PATH);

  const tableColumns = [
    { attr: "statusCode", header: "Status Code" },
    { attr: "statusName", header: "Status Name" },
    { attr: "displayOrder", header: "Display Order" },
    { attr: "active", header: "Active" },
  ];

  return (
    <DataTable
      api_url={PAYMENT_STATUS_MASTER_API_URL}
      list_url={PAYMENT_STATUS_MASTER_LIST_URL}
      alertString="Payment Status Master"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Payment Status Master"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PAYMENT_STATUS_MASTER_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default PaymentStatusMasterPage;