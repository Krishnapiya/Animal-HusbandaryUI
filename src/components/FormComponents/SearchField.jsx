import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { useState } from "react";
import TextField from "@mui/material/TextField";
const SearchField = (props) => {
  const [searchKey, setSearchkey] = useState("");
  const handleSearchChange = (event) => {
    if (event.target.value == "") {
      props.handleSearch("");
    }
    setSearchkey(event.target.value);
  };
  const handleSearchClick = () => {
    props.handleSearch(searchKey);
  };
  const handleEnterKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      props.handleSearch(searchKey);
    }
  };
  return (
    <>
      <Box sx={{ marginTop: 1 }}>
        <TextField
          placeholder="Search..."
          size="small"
          type="search"
          onChange={handleSearchChange}
          onKeyDown={handleEnterKeyDown}
        ></TextField>
        <IconButton
          onClick={handleSearchClick}
          edge="end"
          disabled={searchKey == ""}
        >
          <SearchRounded />
        </IconButton>
      </Box>
    </>
  );
};

SearchField.propTypes = {
  handleSearch: PropTypes.func,
};

export default SearchField;
