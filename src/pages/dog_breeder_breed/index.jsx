import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import useDropDown from "../../hooks/useDropDown";

import {
  DOG_BREEDER_BREED_API_URL,
  DOG_BREEDER_BREED_LIST_URL,
  DOG_BREEDER_DETAIL_DROPDOWN_URL,
} from "../../config/endpoints";

import useCan from "../../hooks/useCan";
import { useAuthz } from "../../context/AuthzContext";
import { DOG_BREEDER_BREED_PATH } from "../../config/routes";

const DogBreederBreedPage = () => {
  const { can } = useAuthz();

  const {
    canList,
    canSave,
    canEdit,
    canDelete,
  } = useCan(DOG_BREEDER_BREED_PATH);

  const dropDownLists = useDropDown([
    {
      api_url: DOG_BREEDER_DETAIL_DROPDOWN_URL,
      includeToken: true,
      dropdown: "dogBreederDetail",
    },
  ]);

  const tableColumns = [
    {
      attr: "dogBreederDetail",
      header: "Dog Breeder Detail",
      render: (row) =>
        row.dogBreederDetail?.name || "-",
    },

    {
      attr: "breedName",
      header: "Breed Name",
      render: (row) =>
        row.breedName || "-",
    },

    {
      attr: "gender",
      header: "Gender",
      render: (row) =>
        row.gender === "MALE"
          ? "Male"
          : row.gender === "FEMALE"
          ? "Female"
          : "-",
    },

    {
      attr: "dogCount",
      header: "Dog Count",
      render: (row) =>
        row.dogCount ?? 0,
    },

    {
      attr: "ageDescription",
      header: "Age of each dog",
      render: (row) =>
        row.ageDescription || "-",
    },
  ];

  return (
    <DataTable
      api_url={DOG_BREEDER_BREED_API_URL}
      list_url={DOG_BREEDER_BREED_LIST_URL}
      alertString="Dog Breeder Breed"
      tableColumns={tableColumns}
      includeFilter={canList}
      dropDownLists={dropDownLists}
      disableAdd={!canSave}
      pageTitle="Dog Breeder Breed"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(
        DOG_BREEDER_BREED_PATH,
        "export"
      )}
    >
      {/* CHILD 0 → FILTER */}
      <Filter
        dropDownLists={dropDownLists}
      />

      {/* CHILD 1 → FORM DIALOG */}
      <FormDialog maxWidth="md">
        <Form
          dropDownLists={dropDownLists}
        />
      </FormDialog>

      {/* CHILD 2 → LIST */}
      <List />
    </DataTable>
  );
};

export default DogBreederBreedPage;