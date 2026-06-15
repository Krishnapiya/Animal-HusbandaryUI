/* eslint-disable */
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Grid2 as Grid,
  Link,
  Typography,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "material-react-toastify";
import TextInput from "../components/FormComponents/TextInput";
import { registerPetShopOwner } from "../api-client/accounts";
import { encryptStorage } from "../utils";
import {
  LOGIN_PATH,
  PET_SHOP_REGISTER_PATH,
} from "../config/routes";
import { useAuthz } from "../context/AuthzContext";

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

    const response = await registerPetShopOwner(formValues);
    setIsSubmitting(false);

    if (response.isSuccess) {
      encryptStorage.setItem(
        "userAuthDetails",
        JSON.stringify({
          token: response.data.token,
          user: response.data.user,
        }),
      );
      await refreshAuthz();
      toast.success("Account created. Continue with pet shop registration.");
      navigate(`/${PET_SHOP_REGISTER_PATH}`);
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1f2937" }}>
            Register as Pet Shop Owner
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
            Create your login, then complete FORM-1 pet shop registration.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
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
                  backgroundColor: "#2563eb",
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

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link component={RouterLink} to={`/${LOGIN_PATH}`}>
            Sign in
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default PetShopOwnerRegisterPage;
