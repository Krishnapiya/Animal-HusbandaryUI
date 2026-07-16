import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <Grid item size={{ xs: 12, sm: 12 }}>
      <TextInput
        label="Species Name"
        name="speciesName"
        value={props.filterFetchParams.speciesName || ""}
        onChange={(e) =>
          props.setFilterFetchParams((prev) => ({
            ...prev,
            speciesName: e.target.value,
          }))
        }
      />
    </Grid>
  );
};

Filter.propTypes = {
  filterFetchParams: PropTypes.any,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;