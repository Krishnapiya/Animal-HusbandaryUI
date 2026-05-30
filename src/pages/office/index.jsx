import { useEffect, useState } from "react";
import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import { getItemList } from "../../api-client/apiCall";
import { OFFICE_API_URL, OFFICE_LIST_URL } from "../../config/endpoints";
import { OFFICE_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const OfficePage = () => {
  const { can, isAuthzLoading } = useAuthz();
  const { canList, canSave, canEdit, canDelete } = useCan(OFFICE_PATH);
  const [dropDownLists, setDropDownLists] = useState({ parentOffice: [] });

  useEffect(() => {
    if (isAuthzLoading || !canList) {
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await getItemList("/admin/auth/master/office/list/all", {
        dropDown: true,
        pageNo: 0,
        pageSize: 500,
      });
      if (cancelled) return;
      if (res?.isSuccess) {
        const payload = res.data?.payLoad ?? res.data?.payload;
        const list = Array.isArray(payload?.content) ? payload.content : [];
        setDropDownLists({ parentOffice: list });
      } else {
        setDropDownLists({ parentOffice: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthzLoading, canList]);

  const tableColumns = [
    { attr: "id", header: "ID" },
    { attr: "officeType", header: "Office type" },
    { attr: "name", header: "Office name" },
    { attr: "parentName", header: "Parent office" },
  ];

  return (
    <DataTable
      api_url={OFFICE_API_URL}
      list_url={OFFICE_LIST_URL}
      alertString="Office"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Office"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(OFFICE_PATH, "export")}
      dropDownLists={dropDownLists}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default OfficePage;
