import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import TextInput from "../../components/FormComponents/TextInput";
import DropDown from "../../components/FormComponents/DropDown";
import { getItemList } from "../../api-client/apiCall";
import { DISTRICT_DROPDOWN_URL } from "../../config/endpoints";

const Step1ShopOwner = ({
  formValues,
  errors,
  onChange,
  onDropDownChange,
  onSameAsShop,
}) => {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getItemList(DISTRICT_DROPDOWN_URL, {
        dropDown: true,
        pageNo: 0,
        pageSize: 500,
      });
      if (cancelled || !res?.isSuccess) {
        return;
      }
      const payload = res.data?.payLoad ?? res.data?.payload ?? res.data;
      const list = Array.isArray(payload?.content)
        ? payload.content
        : Array.isArray(payload)
          ? payload
          : [];
      setDistricts(list);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "Arial" }}>
        Section 1 — Pet shop & owner (FORM-1 §1–3)
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        To: Member Secretary, Kerala State Animal Welfare Board — Application
        for grant of licence for Pet Shop.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <DropDown
            name="district"
            label="District (shop location)"
            formValues={formValues}
            list={districts}
            onChange={onDropDownChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextInput
            label="1. Name of pet shop"
            name="shopName"
            value={formValues.shopName}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Shop address line 1"
            name="shopAddressLine1"
            value={formValues.shopAddressLine1}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Shop address line 2"
            name="shopAddressLine2"
            value={formValues.shopAddressLine2}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Latitude"
            name="latitude"
            value={formValues.latitude}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Longitude"
            name="longitude"
            value={formValues.longitude}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            label="Shop city"
            name="shopCity"
            value={formValues.shopCity}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            label="Shop pincode"
            name="shopPincode"
            value={formValues.shopPincode}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextInput
            label="2. Name of pet shop owner"
            name="ownerName"
            value={formValues.ownerName}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
  <TextInput
    label="Father/Husband Name"
    name="fatherOrHusbandName"
    value={formValues.fatherOrHusbandName}
    onChange={onChange}
    errors={errors}
    required
  />
</Grid>

<Grid size={{ xs: 12, md: 6 }}>
  <TextInput
    label="Age"
    name="age"
    type="number"
    value={formValues.age}
    onChange={onChange}
    errors={errors}
    required
  />
</Grid>
<Grid size={{ xs: 12 }}>
  <Typography
    variant="subtitle1"
    sx={{
      mt: 2,
      mb: 1,
      fontWeight: 600,
      color: "primary.main",
    }}
  >
    Owner Address
  </Typography>
</Grid>
<Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox checked={formValues.sameAsShop} onChange={onSameAsShop} />
            }
            label="Owner address same as shop address"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextInput
            label="Residential address (r/o)"
            name="ownerResidentialAddress"
            value={formValues.ownerResidentialAddress}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Owner address line 1"
            name="ownerAddressLine1"
            value={formValues.ownerAddressLine1}
            onChange={onChange}
            errors={errors}
            disabled={formValues.sameAsShop}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Owner address line 2"
            name="ownerAddressLine2"
            value={formValues.ownerAddressLine2}
            onChange={onChange}
            errors={errors}
            disabled={formValues.sameAsShop}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextInput
            label="Office address of applicant"
            name="ownerOfficeAddress"
            value={formValues.ownerOfficeAddress}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            label="3. Landline"
            name="contactLandline"
            value={formValues.contactLandline}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            label="Mobile"
            name="contactMobile"
            value={formValues.contactMobile}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            label="Email"
            name="contactEmail"
            value={formValues.contactEmail}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>
        
      </Grid>
    </Box>
  );
};

Step1ShopOwner.propTypes = {
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDropDownChange: PropTypes.func.isRequired,
  onSameAsShop: PropTypes.func.isRequired,
};

export default Step1ShopOwner;
