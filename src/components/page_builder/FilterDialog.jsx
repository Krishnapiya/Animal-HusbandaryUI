import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import useModal from "../../hooks/useModal";
import { useState, useEffect, Children, cloneElement } from "react";
import { useSearchParams } from "react-router-dom";
import { parseURLParams } from "../../utils";
const FilterDialog = (props) => {
  const [open, handleOpen, handleClose] = useModal();
  const [filterFetchParams, setFilterFetchParams] = useState({});
  const [paramCount, setParamCount] = useState(0);

  const handleOnClose = () => {
    handleClose();
  };
  const handleOnOpen = () => {
    handleOpen();
  };
  const handleFilterClick = () => {
    const val_arr = Object.values(filterFetchParams).filter(
      (item) => item.length > 0
    );
    setParamCount(val_arr.length);
    props.handleFilterTable(filterFetchParams);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  // to handle search based on url params used to apply filter from dashboard
  useEffect(() => {
    if (!searchParams) return;
    const url_params = parseURLParams(searchParams);
    if (url_params.filter) {
      delete url_params.filter;
      setFilterFetchParams(url_params);
      const val_arr = Object.values(url_params).filter(
        (item) => item.length > 0
      );
      setParamCount(val_arr.length);
      props.handleFilterTable(url_params);
    }
    setSearchParams(undefined);
  }, [searchParams]);
  useEffect(() => {
    if (props.clearAttributeFilter) {
      setFilterFetchParams({});
      setParamCount(0);
      props.setClearAttributeFilter(false);
    }
  }, [props.clearAttributeFilter]);
  const children_array = Children.toArray(props.children);
  return (
    <>
      <Tooltip title="Filter" placement="bottom">
        <IconButton onClick={handleOnOpen}>
          <Badge badgeContent={paramCount} color="secondary">
            <FilterAltIcon color="info" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleOnClose} maxWidth="sm" fullWidth>
        <DialogTitle>Filter</DialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1, paddingTop: 1 }}>
            <Grid spacing={1} container>
              {/* {props.filterConfig.drop_down.map((config, index) => (
                  <Grid item xs={12} key={index}>
                    <MultipleDropDown
                      config={config}
                      list={props.dropDownLists[config.dropdown_param]}
                      filterFetchParams={filterFetchParams}
                      setFilterFetchParams={setFilterFetchParams}
                    />
                  </Grid>
                ))} */}
              {cloneElement(children_array[0], {
                dropDownLists: props.dropDownLists,
                filterFetchParams: filterFetchParams,
                setFilterFetchParams: setFilterFetchParams
              })}
            </Grid>
          </Box>{" "}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleOnClose} color="secondary" variant="contained">
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleFilterClick}
          >
            Filter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

FilterDialog.propTypes = {
  children: PropTypes.any,
  clearAttributeFilter: PropTypes.bool,
  dropDownLists: PropTypes.object,
  filterConfig: PropTypes.object,
  handleFilterTable: PropTypes.func,
  setClearAttributeFilter: PropTypes.func
};

export default FilterDialog;
