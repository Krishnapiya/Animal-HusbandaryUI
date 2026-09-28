import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Form from "./Form";
import Filter from "./Filter";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";

import {
  ANIMAL_SPECIES_API_URL,
  ANIMAL_SPECIES_LIST_URL,
} from "../../config/endpoints";

import { ANIMAL_SPECIES_PATH } from "../../config/routes";

import useCan from "../../hooks/useCan";
import useDropDown from "../../hooks/useDropDown";

const AnimalSpeciesMasterPage = () => {
  const { can } = useAuthz();

  const {
    canList,
    canSave,
    canEdit,
    canDelete,
  } = useCan(ANIMAL_SPECIES_PATH);

  const dropDownLists = useDropDown([
    {
      api_url: "/admin/auth/master/animal-species/list/all",
      includeToken: true,
      dropdown: "animalSpecies",
    },
  ]);

  const tableColumns = [
    {
      attr: "speciesName",
      header: "Name",
    },
    {
      attr: "type",
      header: "Type",
      sortable: false,
    },
    {
      attr: "parentSpecies",
      header: "Parent Species",
      sortable: false,
    },
    {
      attr: "isActive",
      header: "Active",
    },
  ];

  return (
    <DataTable
      api_url={ANIMAL_SPECIES_API_URL}
      list_url={ANIMAL_SPECIES_LIST_URL}
      alertString="Animal Species"
      tableColumns={tableColumns}
      dropDownLists={dropDownLists}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="Animal Species"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(
        ANIMAL_SPECIES_PATH,
        "export"
      )}
    >
      <Filter />

      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>

      <List />
    </DataTable>
  );
};

export default AnimalSpeciesMasterPage;