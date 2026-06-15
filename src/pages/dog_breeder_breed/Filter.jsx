import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import MultipleDropDown from "../../components/page_builder/MultipleDropDown";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      {/* Dog Breeder Detail */}
      <Grid item size={{ xs: 12, sm: 4 }}>
        <MultipleDropDown
          list={props.dropDownLists["dogBreederDetail"]}
          filterFetchParams={props.filterFetchParams}
          setFilterFetchParams={props.setFilterFetchParams}
          param="dogBreederDetailId"
          label="Dog Breeder Detail"
        />
      </Grid>

      {/* Breed Name */}
      <Grid item size={{ xs: 12, sm: 4 }}>
        <TextInput
          label="Breed Name"
          name="breedName"
          value={props.filterFetchParams.breedName || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              breedName: e.target.value,
            }))
          }
        />
      </Grid>

      {/* Dog Count */}
      <Grid item size={{ xs: 12, sm: 4 }}>
        <TextInput
          label="Dog Count"
          name="dogCount"
          value={props.filterFetchParams.dogCount || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              dogCount: e.target.value,
            }))
          }
        />
      </Grid>
    </>
  );
};

Filter.propTypes = {
  dropDownLists: PropTypes.any,
  filterFetchParams: PropTypes.any,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;