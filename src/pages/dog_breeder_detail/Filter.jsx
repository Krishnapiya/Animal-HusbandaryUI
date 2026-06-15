import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Breeder Name"
          value={props.filterFetchParams.breederName || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              breederName: e.target.value,
            }))
          }
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="City"
          value={props.filterFetchParams.city || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              city: e.target.value,
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