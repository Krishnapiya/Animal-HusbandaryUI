import PropTypes from "prop-types";
import { useState, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "material-react-toastify";

import TextInput from "../../components/FormComponents/TextInput";
import DropDown from "../../components/FormComponents/DropDown";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";
import { getItemList } from "../../api-client/apiCall";

const Form = (props) => {
  const formFields = {
    id: "",
    speciesName: "",
    parentId: null,
    isActive: true,
  };

  const [type, setType] = useState("Species");
  const [speciesRecords, setSpeciesRecords] = useState([]);

  const {
    formValues,
    setFormValues,
    errors,
    setErrorMessages,
    isSubmitting,
    handleChangeFormValues,
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

  // Load top-level species records dynamically from the API
  const fetchSpeciesRecords = useCallback(async () => {
    try {
      const response = await getItemList(
        "/admin/auth/master/animal-species/list/all",
        { pageNo: 0, pageSize: 500 }
      );
      const p = response.data?.payLoad ?? response.data?.payload;
      const list = Array.isArray(p?.content)
        ? p.content
        : Array.isArray(p)
        ? p
        : [];
      setSpeciesRecords(list);
    } catch (err) {
      console.error("Failed to fetch species list", err);
    }
  }, []);

  useEffect(() => {
    fetchSpeciesRecords();
  }, [fetchSpeciesRecords]);

  // Combine fetched species with props.dropDownLists if present
  const allRecords = useMemo(() => {
    if (speciesRecords.length > 0) return speciesRecords;
    return props.dropDownLists?.animalSpecies || [];
  }, [speciesRecords, props.dropDownLists]);

  // Top-level species only: parentId == null (exclude self when editing)
  const parentSpeciesOptions = useMemo(() => {
    return allRecords
      .filter(
        (item) =>
          item.parentId == null &&
          (!formValues.id || String(item.id) !== String(formValues.id))
      )
      .map((item) => ({
        id: item.id,
        name: item.speciesName || item.name || "",
        speciesName: item.speciesName || item.name || "",
      }));
  }, [allRecords, formValues.id]);

  // Sync type on edit mode / insert mode
  useEffect(() => {
    if (props.operationType === "edit") {
      if (formValues.parentId != null && formValues.parentId !== "") {
        setType("Breed");
      } else {
        setType("Species");
      }
    } else if (props.operationType === "insert") {
      setType("Species");
    }
  }, [props.operationType, props.rowID, formValues.id]);

  // Handle Type change: Species vs Breed
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);

    if (newType === "Species") {
      // Immediately clear parentId and hide Parent Species
      setFormValues((prev) => ({
        ...prev,
        parentId: null,
      }));
      setErrorMessages({});
    }
  };

  // Find the selected parent option object for DropDown
  const selectedParent = useMemo(() => {
    if (formValues.parentId == null || formValues.parentId === "") return null;
    return (
      parentSpeciesOptions.find(
        (opt) => String(opt.id) === String(formValues.parentId)
      ) || null
    );
  }, [formValues.parentId, parentSpeciesOptions]);

  // Handle Parent Species dropdown change
  const handleParentSpeciesChange = (_, value) => {
    setFormValues((prev) => ({
      ...prev,
      parentId: value ? value.id : null,
    }));
    setErrorMessages({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = String(formValues.speciesName || "").trim();
    if (!trimmedName) {
      toast.error(type === "Breed" ? "Enter breed name." : "Enter species name.");
      setErrorMessages({
        speciesName: [
          type === "Breed" ? "Breed name is required" : "Species name is required",
        ],
      });
      return;
    }

    if (type === "Breed" && (formValues.parentId == null || formValues.parentId === "")) {
      toast.error("Select parent species.");
      setErrorMessages({
        parentId: ["Parent species is required"],
      });
      return;
    }

    const payload = {
      speciesName: trimmedName,
      parentId: type === "Breed" ? Number(formValues.parentId) : null,
      isActive: formValues.isActive ?? true,
    };

    if (props.operationType === "edit" && formValues.id) {
      payload.id = formValues.id;
    }

    try {
      if (props.operationType === "insert") {
        await handleInsert(payload);
      } else if (props.operationType === "edit") {
        await handleUpdate(payload);
      }
      fetchSpeciesRecords();
    } catch (error) {
      console.error("Animal species save error:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Type dropdown */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="species-type-label">Type</InputLabel>
              <Select
                labelId="species-type-label"
                id="species-type-select"
                value={type}
                label="Type"
                onChange={handleTypeChange}
              >
                <MenuItem value="Species">Species</MenuItem>
                <MenuItem value="Breed">Breed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Name input (Species Name or Breed Name) */}
          <Grid size={{ xs: 12 }}>
            <TextInput
              label={type === "Breed" ? "Breed Name" : "Species Name"}
              name="speciesName"
              value={formValues.speciesName || ""}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          {/* Parent Species dropdown (only in Breed mode) */}
          {type === "Breed" && (
            <Grid size={{ xs: 12 }}>
              <DropDown
                name="parentId"
                formValues={{
                  ...formValues,
                  parentId: selectedParent,
                }}
                onChange={handleParentSpeciesChange}
                list={parentSpeciesOptions}
                label="Parent Species"
                errors={errors}
                required
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <FormButtons
              operationType={props.operationType}
              onCancelClick={props.handleCloseFormModal}
              disabled={isSubmitting || props.canSave === false}
              isAddAnotherRequired={false}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

Form.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  dropDownLists: PropTypes.object,
  handleCloseFormModal: PropTypes.func,
  handleRefreshTable: PropTypes.func,
  operationType: PropTypes.string,
  rowID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  canSave: PropTypes.bool,
};

export default Form;