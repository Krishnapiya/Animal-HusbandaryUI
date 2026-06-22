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

import { ANIMAL_SPECIES_PATH }
from "../../config/routes";

import useCan from "../../hooks/useCan";

const AnimalSpeciesMasterPage = () => {
  const { can } = useAuthz();

  const {
    canList,
    canSave,
    canEdit,
    canDelete,
  } = useCan(ANIMAL_SPECIES_PATH);

  const tableColumns = [
    {
      attr: "speciesName",
      header: "Species Name",
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