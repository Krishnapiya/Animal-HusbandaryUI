/* eslint-disable */
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import DropDown from "../../components/FormComponents/DropDown";

import useForm from "../../hooks/useForm";
import { toast } from "material-react-toastify";

const GENDER_OPTIONS = [
  {
    value: "MALE",
    label: "Male",
  },
  {
    value: "FEMALE",
    label: "Female",
  },
];

const Form = (props) => {
  /*
   * IMPORTANT:
   * gender must be present in formFields.
   */
  const formFields = {
    dogBreederDetail: null,
    breedName: "",
    dogCount: "",
    ageDescription: "",
    gender: "",
  };

  const {
    formValues,
    errors,
    isSubmitting,
    handleChangeFormValues,
    handleChangeDropDown,
    handleInsert,
    handleUpdate,
  } = useForm(
    formFields,
    null,
    props.api_url,
    props.alertString,
    props.handleCloseFormModal,
    props.handleRefreshTable,
    props.rowID,
    props.operationType
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
     * Dog breeder detail validation
     */
    if (!formValues.dogBreederDetail?.id) {
      toast.error(
        "Select dog breeder detail."
      );
      return;
    }

    /*
     * Breed name validation
     */
    if (
      !formValues.breedName ||
      formValues.breedName.trim() === ""
    ) {
      toast.error(
        "Enter breed name."
      );
      return;
    }

    /*
     * Gender validation
     */
    if (
      !formValues.gender ||
      formValues.gender.trim() === ""
    ) {
      toast.error(
        "Select gender."
      );
      return;
    }

    /*
     * Dog count validation
     */
    if (
      formValues.dogCount === "" ||
      formValues.dogCount === null ||
      formValues.dogCount === undefined
    ) {
      toast.error(
        "Enter dog count."
      );
      return;
    }

    if (
      Number(formValues.dogCount) < 0
    ) {
      toast.error(
        "Dog count cannot be negative."
      );
      return;
    }

    /*
     * EXACT backend payload
     *
     * Backend expects:
     *
     * {
     *   dogBreederDetail: {
     *     id: 39
     *   },
     *   breedName: "...",
     *   dogCount: 2,
     *   ageDescription: "...",
     *   gender: "MALE"
     * }
     */
    const payload = {
      dogBreederDetail: {
        id: Number(
          formValues.dogBreederDetail.id
        ),
      },

      breedName:
        String(
          formValues.breedName || ""
        ).trim(),

      dogCount:
        Number(
          formValues.dogCount
        ),

      ageDescription:
        String(
          formValues.ageDescription ||
            ""
        ).trim(),

      gender:
        String(
          formValues.gender || ""
        )
          .trim()
          .toUpperCase(),
    };

    /*
     * Check exactly what is being sent.
     */
    console.log(
      "DOG BREED SAVE PAYLOAD:",
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    try {
      if (
        props.operationType ===
        "insert"
      ) {
        await handleInsert(
          payload
        );
      } else if (
        props.operationType ===
        "edit"
      ) {
        await handleUpdate(
          payload
        );
      }
    } catch (error) {
      console.error(
        "Dog breeder breed save error:",
        error
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form
        onSubmit={handleSubmit}
      >
        <Grid
          container
          spacing={1}
        >
          {/* DOG BREEDER DETAIL */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DropDown
              name="dogBreederDetail"
              formValues={formValues}
              onChange={
                handleChangeDropDown
              }
              list={
                props.dropDownLists?.[
                  "dogBreederDetail"
                ] || []
              }
              label="Dog Breeder Detail"
              errors={errors}
            />
          </Grid>

          {/* BREED NAME */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextInput
              label="Breed Name"
              name="breedName"
              value={
                formValues.breedName ||
                ""
              }
              onChange={
                handleChangeFormValues
              }
              errors={errors}
              required
            />
          </Grid>

          {/* GENDER */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextInput
              select
              label="Gender"
              name="gender"
              value={
                formValues.gender ||
                ""
              }
              onChange={
                handleChangeFormValues
              }
              errors={errors}
              required
            >
              <MenuItem value="">
                <em>
                  Select Gender
                </em>
              </MenuItem>

              {GENDER_OPTIONS.map(
                (option) => (
                  <MenuItem
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </MenuItem>
                )
              )}
            </TextInput>
          </Grid>

          {/* DOG COUNT */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextInput
              label="Dog Count"
              name="dogCount"
              type="number"
              value={
                formValues.dogCount ??
                ""
              }
              onChange={
                handleChangeFormValues
              }
              errors={errors}
              required
            />
          </Grid>

          {/* AGE DESCRIPTION */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextInput
              label="Age of each dog"
              name="ageDescription"
              value={
                formValues.ageDescription ||
                ""
              }
              onChange={
                handleChangeFormValues
              }
              errors={errors}
            />
          </Grid>

          {/* BUTTONS */}
          <Grid
            size={{
              xs: 12,
            }}
          >
            <FormButtons
              operationType={
                props.operationType
              }
              onCancelClick={
                props.handleCloseFormModal
              }
              disabled={
                isSubmitting ||
                props.canSave === false
              }
              isAddAnotherRequired={
                true
              }
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

Form.propTypes = {
  alertString:
    PropTypes.string,

  api_url:
    PropTypes.string,

  dropDownLists:
    PropTypes.object,

  handleRefreshTable:
    PropTypes.func,

  handleCloseFormModal:
    PropTypes.func,

  operationType:
    PropTypes.string,

  rowID:
    PropTypes.string,

  canSave:
    PropTypes.bool,
};

export default Form;