/* eslint-disable */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Box, Grid2 as Grid, Typography } from "@mui/material";

import TextInput from "../../components/FormComponents/TextInput";
import DropDown from "../../components/FormComponents/DropDown";
import { getItemList } from "../../api-client/apiCall";
import { DISTRICT_DROPDOWN_URL } from "../../config/endpoints";

const Step1BreederDetails = ({
  formValues,
  errors,
  onChange,
  onDropDownChange,
}) => {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadDistricts = async () => {
      try {
        const res = await getItemList(DISTRICT_DROPDOWN_URL, {
          dropDown: true,
          pageNo: 0,
          pageSize: 500,
        });

        if (cancelled || !res?.isSuccess) {
          return;
        }

        const payload =
          res?.data?.payLoad ??
          res?.data?.payload ??
          res?.data?.data ??
          res?.data ??
          null;

        const list = Array.isArray(payload?.content)
          ? payload.content
          : Array.isArray(payload)
            ? payload
            : [];

        setDistricts(list);
      } catch (error) {
        console.error("Could not load districts:", error);
      }
    };

    loadDistricts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "Arial" }}>
        Section 1 — Breeder & establishment details
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Kerala State Animal Welfare Board — Application for registration of
        breeder.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <DropDown
            name="district"
            label="District"
            formValues={formValues}
            list={districts}
            onChange={onDropDownChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            label="1. Name of applicant / breeder"
            name="breederName"
            value={formValues.breederName || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="2. Establishment address line 1"
            name="addressLine1"
            value={formValues.addressLine1 || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Address line 2"
            name="addressLine2"
            value={formValues.addressLine2 || ""}
            onChange={onChange}
            errors={errors}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="City"
            name="city"
            value={formValues.city || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Pincode"
            name="pincode"
            value={formValues.pincode || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="3. Mobile number"
            name="contactMobile"
            value={formValues.contactMobile || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Email"
            name="contactEmail"
            value={formValues.contactEmail || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            label="4. Details of accommodation and infrastructure available"
            name="facilityDetails"
            value={formValues.facilityDetails || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Total dogs count"
            name="totalDogsCount"
            value={formValues.totalDogsCount || ""}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Step1BreederDetails.propTypes = {
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDropDownChange: PropTypes.func.isRequired,
};

export default Step1BreederDetails;