import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Application Number"
          name="applicationNumber"
          value={props.filterFetchParams?.applicationNumber || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              applicationNumber: e.target.value,
              entityType: "DOG_BREEDER",
            }))
          }
        />
      </Grid>
    </>
  );
};

Filter.propTypes = {
  filterFetchParams: PropTypes.object,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;