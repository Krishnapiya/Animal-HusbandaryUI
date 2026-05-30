import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
const FormButtons = ({
  operationType,
  disabled,
  onCancelClick,
  isAddAnotherRequired,
}) => {
  return (
    <Box
      sx={{
        marginTop: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 0.5,
      }}
    >
      {operationType == "insert" && (
        <>
          <Button
            type="submit"
            disabled={disabled}
            variant="contained"
            color="success"
            size="small"
          >
            Add
          </Button>
          {isAddAnotherRequired && (
            <Button
              type="submit"
              disabled={disabled}
              variant="contained"
              color="success"
              name="add_another"
              size="small"
            >
              Add Another
            </Button>
          )}
        </>
      )}
      {operationType == "edit" && (
        <Button
          type="submit"
          disabled={disabled}
          variant="contained"
          color="success"
          size="small"
        >
          Edit
        </Button>
      )}
      <Button
        onClick={onCancelClick}
        disabled={disabled}
        color="secondary"
        variant="contained"
        size="small"
      >
        Cancel
      </Button>
    </Box>
  );
};

FormButtons.propTypes = {
  disabled: PropTypes.bool,
  isAddAnotherRequired: PropTypes.bool,
  onCancelClick: PropTypes.func,
  operationType: PropTypes.string,
};

export default FormButtons;
