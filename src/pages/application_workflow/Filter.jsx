import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  const {
    filterValues,
    errors,
    handleChangeFormValues,
  } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <TextInput
            label="Module Name"
            name="moduleName"
            value={filterValues?.moduleName || ""}
            onChange={handleChangeFormValues}
            errors={errors}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            label="Application ID"
            name="applicationId"
            value={filterValues?.applicationId || ""}
            onChange={handleChangeFormValues}
            errors={errors}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            label="Action By"
            name="actionBy"
            value={filterValues?.actionBy || ""}
            onChange={handleChangeFormValues}
            errors={errors}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Filter.propTypes = {
  filterValues: PropTypes.object,
  errors: PropTypes.object,
  handleChangeFormValues: PropTypes.func,
};

export default Filter;