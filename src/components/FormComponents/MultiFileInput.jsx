import PropTypes from "prop-types";
import { MuiFileInput } from "mui-file-input";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Stack from "@mui/material/Stack";
const MultiFileInput = (props) => {
  return (
    <Stack direction={"row"}>
      <MuiFileInput
        multiple
        label={props.label}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        variant="outlined"
        onChange={props.onChange}
        fullWidth
        size="small"
        clearIconButtonProps={{
          title: "Remove",
          children: <CloseOutlined fontSize="small" />,
        }}
      />
    </Stack>
  );
};

MultiFileInput.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default MultiFileInput;
