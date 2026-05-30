/* eslint-disable */
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";

const MultiSelectList = ({
  dataList,
  name,
  handleChangeMultiSelectList,
  formValues,
}) => {
  const [checked, setChecked] = useState(formValues[name] || []);

  useEffect(() => {
    // Update checked state when formValues[name] changes
    setChecked(formValues[name] || []);
  }, [formValues, name]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    handleChangeMultiSelectList(checked, name);
  }, [checked, name]);

  return (
    <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
      {dataList.map((item, index) => {
        const labelId = `checkbox-list-secondary-label-${index}`;
        return (
          <ListItem
            key={index}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(item.id)}
                checked={checked.includes(item.id)}
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemText id={item.id} primary={item.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

MultiSelectList.propTypes = {
  dataList: PropTypes.array.isRequired,
  formValues: PropTypes.object.isRequired,
  handleChangeMultiSelectList: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default MultiSelectList;
