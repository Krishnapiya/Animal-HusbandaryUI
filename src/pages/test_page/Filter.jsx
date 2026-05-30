import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import MultipleDropDown from "../../components/page_builder/MultipleDropDown";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Username"
          name="username"
          value={props.filterFetchParams.username || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
        />
      </Grid>

      <Grid item size={{ xs: 12, sm: 6 }}>
        <MultipleDropDown
          list={props.dropDownLists["role"]}
          filterFetchParams={props.filterFetchParams}
          setFilterFetchParams={props.setFilterFetchParams}
          param="role"
          label="Role"
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
