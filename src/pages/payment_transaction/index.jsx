import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import useDropDown from "../../hooks/useDropDown";
import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  PAYMENT_TRANSACTION_API_URL,
  PAYMENT_TRANSACTION_LIST_URL,
  REGISTRATION_APPLICATION_DROPDOWN_URL,
  PAYMENT_STATUS_MASTER_DROPDOWN_URL,
  USER_DROPDOWN_URL,
} from "../../config/endpoints";

import { PAYMENT_TRANSACTION_PATH } from "../../config/routes";

const PaymentTransactionPage = () => {
  const { can } = useAuthz();

  const { canList, canSave, canEdit, canDelete } =
    useCan(PAYMENT_TRANSACTION_PATH);

  const dropDownLists = useDropDown([
    {
      api_url: REGISTRATION_APPLICATION_DROPDOWN_URL,
      includeToken: true,
      dropdown: "applicationId",
    },
    {
      api_url: PAYMENT_STATUS_MASTER_DROPDOWN_URL,
      includeToken: true,
      dropdown: "statusId",
    },
    {
      api_url: USER_DROPDOWN_URL,
      includeToken: true,
      dropdown: "payerUserId",
    },
  ]);

  const tableColumns = [
    { attr: "transactionRef", header: "Transaction Ref" },

    {
      attr: "applicationNumber",
      header: "Application",
      render: (row) => row.applicationNumber || row.applicationId || "-",
    },

    { attr: "paymentPurpose", header: "Payment Purpose" },
    { attr: "amount", header: "Amount" },
    { attr: "currency", header: "Currency" },

    {
      attr: "statusName",
      header: "Payment Status",
      render: (row) => row.statusName || row.statusId || "-",
    },

    { attr: "gatewayName", header: "Gateway Name" },
    { attr: "gatewayOrderId", header: "Gateway Order" },
    { attr: "gatewayPaymentId", header: "Gateway Payment" },
    { attr: "receiptNumber", header: "Receipt Number" },
    { attr: "paymentDate", header: "Payment Date" },

    {
      attr: "payerUserName",
      header: "Payer User",
      render: (row) => row.payerUserName || row.payerUserId || "-",
    },
  ];

  return (
    <DataTable
      api_url={PAYMENT_TRANSACTION_API_URL}
      list_url={PAYMENT_TRANSACTION_LIST_URL}
      alertString="Payment Transaction"
      tableColumns={tableColumns}
      includeFilter={canList}
      dropDownLists={dropDownLists}
      disableAdd={!canSave}
      pageTitle="Payment Transaction"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(PAYMENT_TRANSACTION_PATH, "export")}
    >
      <Filter dropDownLists={dropDownLists} />

      <FormDialog maxWidth="md">
        <Form dropDownLists={dropDownLists} />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default PaymentTransactionPage;

