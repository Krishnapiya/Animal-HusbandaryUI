import PropTypes from "prop-types";
import { MuiFileInput } from "mui-file-input";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Stack from "@mui/material/Stack";
import FileDeleteButton from "../button/FileDeleteButton";
const FileInput = (props) => {
  const handleDelete = () => {
    props.onDelete(props.name);
  };
  return (
    <Stack direction={"row"}>
      <MuiFileInput
        label={props.label}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        variant="outlined"
        onChange={props.onChange}
        fullWidth
        size="small"
        error={Boolean(props.errors && props.errors[props.name]).valueOf()}
        helperText={props.errors && props.errors[props.name]}
        clearIconButtonProps={{
          title: "Remove",
          children: <CloseOutlined fontSize="small" />,
        }}
        inputProps={props.inputProps}
      />

      {
        /*eslint-disable*/ !!props.value ? (
          <FileDeleteButton onClick={handleDelete} />
        ) : (
          ""
        ) /*eslint-disable*/
      }
    </Stack>
  );
};

FileInput.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.any,
  inputProps: PropTypes.any,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  value: PropTypes.any,
};

export default FileInput;
