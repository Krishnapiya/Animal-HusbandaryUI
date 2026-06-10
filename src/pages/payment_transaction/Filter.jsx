import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";

import MultipleDropDown from "../../components/page_builder/MultipleDropDown";

const Filter = (props) => {
  const { filterFetchParams, setFilterFetchParams, dropDownLists = {} } = props;

  

  return (
    <>
      {/* Application */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <MultipleDropDown
          list={dropDownLists["applicationId"] || []}
          filterFetchParams={filterFetchParams}
          setFilterFetchParams={setFilterFetchParams}
          param="applicationId"
          label="Application"
        />
      </Grid>


      {/* Payment Status */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <MultipleDropDown
          list={dropDownLists["statusId"] || []}
          filterFetchParams={filterFetchParams}
          setFilterFetchParams={setFilterFetchParams}
          param="statusId"
          label="Payment Status"
        />
      </Grid>


      {/* Payer User */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <MultipleDropDown
          list={dropDownLists["payerUserId"] || []}
          filterFetchParams={filterFetchParams}
          setFilterFetchParams={setFilterFetchParams}
          param="payerUserId"
          label="Payer User"
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