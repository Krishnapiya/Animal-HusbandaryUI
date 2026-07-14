/* eslint-disable */
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CssBaseline,
  Grid2 as Grid,
  Link,
  Typography,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "material-react-toastify";
import TextInput from "../components/FormComponents/TextInput";
import { registerPetShopOwner } from "../api-client/accounts";
import { encryptStorage } from "../utils";
import {
  LOGIN_PATH,
  PET_SHOP_REGISTER_PATH,
  DOG_BREEDER_REGISTER_PATH
} from "../config/routes";
import { useAuthz } from "../context/AuthzContext";
import AppBrandHeader from "../components/branding/AppBrandHeader";
import AuthSplitLayout from "../components/branding/AuthSplitLayout";
import {
  BRAND_COLORS,
  BRAND_TEXT,
} from "../config/branding";

const initialForm = {
  fname: "",
  lname: "",
  email: "",
  mobileNo: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const PetShopOwnerRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ownerType = searchParams.get("ownerType") || "PET_SHOP";
  const isDogBreeder = ownerType === "DOG_BREEDER";

  const { refreshAuthz } = useAuthz();
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      ...formValues,
      ownerType: ownerType,
    };

    const response = await registerPetShopOwner(payload);
    setIsSubmitting(false);

    if (response.isSuccess) {
      encryptStorage.setItem(
        "userAuthDetails",
        JSON.stringify({
          token: response.data.token,
          user: response.data.user,
        })
      );

      await refreshAuthz();

      toast.success(
        isDogBreeder
          ? "Account created. Continue with dog breeder registration."
          : "Account created. Continue with pet shop registration."
      );

      navigate(
  isDogBreeder
    ? `/${DOG_BREEDER_REGISTER_PATH}`
    : `/${PET_SHOP_REGISTER_PATH}`
);
      return;
    }

    const data = response.data ?? {};
    if (typeof data === "object" && !Array.isArray(data)) {
      setErrors(data);
      const firstError = Object.values(data)[0];
      if (firstError) {
        toast.error(String(firstError));
      }
    } else {
      toast.error("Registration failed");
    }
  };

  return (
    <AuthSplitLayout>
      <CssBaseline />

      <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
        <AppBrandHeader
          compact
          title={
            isDogBreeder
              ? "Dog Breeder Registration"
              : "Pet Shop Owner Registration"
          }
          subtitle={
            isDogBreeder
              ? "Create your login, then complete dog breeder registration."
              : "Create your login, then complete FORM-1 pet shop registration."
          }
        />
      </Box>

      <Card
        sx={{
          borderRadius: 2,
          backgroundColor: BRAND_COLORS.white,
          border: `1px solid ${BRAND_COLORS.border}`,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
          <CardHeader
            title="Account details"
            subheader="Basic information to create your login"
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="First name"
                    name="fname"
                    value={formValues.fname}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Last name"
                    name="lname"
                    value={formValues.lname}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Mobile (10 digits)"
                    name="mobileNo"
                    value={formValues.mobileNo}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextInput
                    label="Username"
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    value={formValues.password}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  mb: 1,
                  textTransform: "none",
                  backgroundColor: BRAND_COLORS.primary,
                  "&:hover": {
                    backgroundColor: BRAND_COLORS.primaryDark,
                  },
                }}
              >
                {isSubmitting ? "Creating account..." : "Create account & continue"}
              </Button>

              <Button
                component={RouterLink}
                to={`/${LOGIN_PATH}`}
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{ textTransform: "none" }}
              >
                Back to sign in
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" align="center" sx={{ mt: 2, color: BRAND_COLORS.grey }}>
          Already have an account?{" "}
          <Link component={RouterLink} to={`/${LOGIN_PATH}`}>
            Sign in
          </Link>
        </Typography>
    </AuthSplitLayout>
  );
};

export default PetShopOwnerRegisterPage;
