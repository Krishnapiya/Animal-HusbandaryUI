import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

const RecordsPerPage = ({ fetchParams, handleChangePageSize }) => {
  const [customPageSize, setCustomPageSize] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuItems = [10, 15, 20, 25, 50, 100];

  const handleCustomPageSizeChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 1) {
      setCustomPageSize(value);
    }
  };
  useEffect(() => {
    if (menuItems.includes(fetchParams.page_size)) {
      setCustomPageSize(fetchParams.page_size);
    }
  }, [fetchParams.page_size]);

  const handleCustomPageSizeSubmit = () => {
    const customValue = parseInt(customPageSize, 10);
    if (!isNaN(customValue) && customValue > 0) {
      handleChangePageSize({ target: { value: customValue } });
      setIsDropdownOpen(false); // Close the dropdown
    }
  };

  const handleOpen = () => setIsDropdownOpen(true);
  const handleClose = () => setIsDropdownOpen(false);

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="demo-select-small-label">Select Page Size</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={fetchParams.page_size}
          label="Select Page Size"
          onChange={handleChangePageSize}
          open={isDropdownOpen}
          onClose={handleClose}
          onOpen={handleOpen}
        >
          {menuItems.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}

          {!isDropdownOpen && customPageSize && (
            <MenuItem value={customPageSize}>{customPageSize}</MenuItem>
          )}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          sx={{ width: 150 }}
          size="small"
          variant="outlined"
          placeholder="Enter Page Size"
          label="Enter Page Size"
          value={customPageSize}
          onChange={handleCustomPageSizeChange}
          type="number"
          inputProps={{ min: 1 }}
          onClick={(event) => event.stopPropagation()} // Prevent dropdown close on click
        />
        <Button
          variant="contained"
          size="small"
          onClick={(event) => {
            event.stopPropagation(); // Prevent dropdown close on button click
            handleCustomPageSizeSubmit();
          }}
        >
          Go
        </Button>
      </Box>
    </Box>
  );
};

RecordsPerPage.propTypes = {
  fetchParams: PropTypes.object.isRequired,
  handleChangePageSize: PropTypes.func.isRequired,
};

export default RecordsPerPage;
