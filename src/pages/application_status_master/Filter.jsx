import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Status Code"
          name="statusCode"
          value={props.filterFetchParams.statusCode || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              statusCode: e.target.value,
            }))
          }
        />
      </Grid>

      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Status Name"
          name="statusName"
          value={props.filterFetchParams.statusName || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              statusName: e.target.value,
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