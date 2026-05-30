import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const ListFilter = ({ unFilteredList, setFilteredList, search_key }) => {
  const filterArrayOfObjectsByValue = (array, search_key, string) => {
    return array.filter((o) =>
      String(o[search_key]).toLowerCase().includes(string.toLowerCase()),
    );
  };
  const handleSearch = (event) => {
    const filtered_arr = filterArrayOfObjectsByValue(
      unFilteredList,
      search_key,
      event.target.value,
    );
    setFilteredList(filtered_arr);
  };
  return (
    <TextField
      variant="outlined"
      label="Search"
      size="small"
      fullWidth
      onChange={handleSearch}
      focused
    />
  );
};

ListFilter.propTypes = {
  search_key: PropTypes.string,
  setFilteredList: PropTypes.func,
  unFilteredList: PropTypes.array,
};

export default ListFilter;
