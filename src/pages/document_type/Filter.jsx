import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextInput
          label="Code"
          name="code"
          value={props.filterFetchParams.code || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              code: e.target.value,
            }))
          }
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextInput
          label="Name"
          name="name"
          value={props.filterFetchParams.name || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextInput
          label="Entity Scope"
          name="entityScope"
          value={props.filterFetchParams.entityScope || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              entityScope: e.target.value,
            }))
          }
        />
      </Grid>
    </>
  );
};

Filter.propTypes = {
  filterFetchParams: PropTypes.any,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;