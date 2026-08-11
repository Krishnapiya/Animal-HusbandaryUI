/* eslint-disable */
import { useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Link,
  Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PetsIcon from "@mui/icons-material/Pets";
import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import { authenticateOfficer } from "../api-client/accounts";
import { toast } from "material-react-toastify";
import { encryptStorage } from "../utils";
import {
  ROOT_PATH,
  PET_SHOP_OWNER_SIGNUP_PATH,
  PET_SHOP_REGISTER_PATH,
  DOG_BREEDER_REGISTER_PATH,
  CITIZEN_SIGNUP_PATH,
} from "../config/routes";
import { useAuthz } from "../context/AuthzContext";
import AppBrandHeader from "../components/branding/AppBrandHeader";
import AuthSplitLayout from "../components/branding/AuthSplitLayout";
import {
  BRAND_COLORS,
  BRAND_TEXT,
} from "../config/branding";

function Copyright() {
  return (
    <Box sx={{ mt: 3, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        {BRAND_TEXT.footer}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        {BRAND_TEXT.developer} © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshAuthz } = useAuthz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getOwnerType = (user) => {
    return (
      user?.ownerType ||
      user?.entityType ||
      user?.applicantType ||
      user?.userType ||
      ""
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const loginPayload = {
      username: form.username.value,
      password: form.password.value,
    };

    setIsSubmitting(true);

    const response = await authenticateOfficer(loginPayload);

    setIsSubmitting(false);

    if (response?.isSuccess) {
      const user = response.data?.user;
      const token = response.data?.token;

      encryptStorage.setItem(
        "userAuthDetails",
        JSON.stringify({
          token: token,
          user: user,
        })
      );

      await refreshAuthz();

      const ownerType = getOwnerType(user);

      if (ownerType === "DOG_BREEDER") {
        navigate(`/${DOG_BREEDER_REGISTER_PATH}`);
        return;
      }

     if (ownerType === "PET_SHOP") {
  navigate(`/${PET_SHOP_REGISTER_PATH}`);
  return;
}

if (ownerType === "CITIZEN") {
  navigate(`/${ROOT_PATH}`);
  return;
}

navigate(`/${ROOT_PATH}`);
return;
    }

    const errData = response?.data ?? {};

    if (errData?.non_field_errors) {
      toast.error(errData.non_field_errors[0]);
    } else if (errData?.detail) {
      toast.error(Array.isArray(errData.detail) ? errData.detail[0] : errData.detail);
    } else {
      toast.error("Login failed");
    }
  };

  return (
    <AuthSplitLayout>
      <CssBaseline />

      <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
        <AppBrandHeader
          compact
          title={BRAND_TEXT.portalTitle}
          subtitle="Pet shop, dog breeder, and departmental user access"
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
          title="Sign In"
          subheader="Use your username and password to access the portal"
          sx={{ textAlign: "center", mt: 1 }}
        />

        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              variant="outlined"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                mt: 3,
                mb: 2,
                textTransform: "none",
                backgroundColor: BRAND_COLORS.primary,
                "&:hover": {
                  backgroundColor: BRAND_COLORS.primaryDark,
                },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">
                New applicant registration
              </Typography>
            </Divider>

            <Button
              component={RouterLink}
              to={`/${PET_SHOP_OWNER_SIGNUP_PATH}`}
              fullWidth
              variant="outlined"
              startIcon={<PersonAddAlt1Icon />}
              sx={{
                mb: 2,
                textTransform: "none",
                borderColor: BRAND_COLORS.primary,
                color: BRAND_COLORS.primary,
              }}
            >
              Register as Pet Shop Owner
            </Button>

            <Button
              component={RouterLink}
              to={`/${PET_SHOP_OWNER_SIGNUP_PATH}?ownerType=DOG_BREEDER`}
              fullWidth
              variant="outlined"
              startIcon={<PetsIcon />}
              sx={{
                mb: 1,
                textTransform: "none",
                borderColor: BRAND_COLORS.primary,
                color: BRAND_COLORS.primary,
              }}
            >
              Register as Dog Breeder
            </Button>
            <Button
  component={RouterLink}
  to={`/${CITIZEN_SIGNUP_PATH}`}
  fullWidth
  variant="outlined"
  startIcon={<PersonAddAlt1Icon />}
  sx={{
    mb: 1,
    textTransform: "none",
    borderColor: BRAND_COLORS.primary,
    color: BRAND_COLORS.primary,
  }}
>
  Register as Citizen
</Button>
          </Box>
        </CardContent>
      </Card>

     <Typography
  variant="body2"
  align="center"
  sx={{ mt: 2, color: BRAND_COLORS.grey }}
>
  New applicant?{" "}
  <Link component={RouterLink} to={`/${CITIZEN_SIGNUP_PATH}`}>
    Register as Citizen
  </Link>{" "}
  or choose one of the registration options above.
</Typography>

      <Copyright />
    </AuthSplitLayout>
  );
};

export default LoginPage;
