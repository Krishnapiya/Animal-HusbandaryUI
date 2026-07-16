import { useEffect, useState } from "react";
import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import { getItemList } from "../../api-client/apiCall";
import {
  OFFICE_API_URL,
  OFFICE_LIST_URL,
  DISTRICT_DROPDOWN_URL,
  OFFICEE_DROPDOWN_URL
} from "../../config/endpoints";
import { OFFICE_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const OfficePage = () => {

  const { can, isAuthzLoading } = useAuthz();

  const { canList, canSave, canEdit, canDelete } = useCan(OFFICE_PATH);


  const [dropDownLists, setDropDownLists] = useState({
    parentOffice: [],
    district: [],
  });


  useEffect(() => {

    if (isAuthzLoading || !canList) {
      return;
    }


    let cancelled = false;


    const loadDropdownLists = async () => {

      const officeRes = await getItemList(
        OFFICEE_DROPDOWN_URL,
        {
          dropDown: true,
          pageNo: 0,
          pageSize: 500,
        }
      );


      const districtRes = await getItemList(
        DISTRICT_DROPDOWN_URL,
        {
          dropDown: true,
          pageNo: 0,
          pageSize: 500,
        }
      );


      if (cancelled) {
        return;
      }


      let parentOffice = [];
      let district = [];


      if (officeRes?.isSuccess) {

        const payload =
          officeRes.data?.payLoad ??
          officeRes.data?.payload;

        parentOffice = Array.isArray(payload?.content)
          ? payload.content
          : [];

      }


      if (districtRes?.isSuccess) {

        const payload =
          districtRes.data?.payLoad ??
          districtRes.data?.payload;

        district = Array.isArray(payload?.content)
          ? payload.content
          : [];

      }


      setDropDownLists({
        parentOffice,
        district,
      });

    };


    loadDropdownLists();


    return () => {
      cancelled = true;
    };


  }, [isAuthzLoading, canList]);



  const tableColumns = [

    {
      attr: "id",
      header: "ID",
    },

    {
      attr: "officeType",
      header: "Office type",
    },

    {
      attr: "name",
      header: "Office name",
    },

    {
      attr: "districtName",
      header: "District",
    },

    {
      attr: "parentName",
      header: "Parent office",
    },

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

        <Form
          dropDownLists={dropDownLists}
          canSave={canSave}
        />

      </FormDialog>


      <List />


    </DataTable>

  );
};


export default OfficePage;