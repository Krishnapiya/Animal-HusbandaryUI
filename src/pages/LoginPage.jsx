/* eslint-disable */
import { useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
  Link,
} from "@mui/material";
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
} from "../config/routes";
import { useAuthz } from "../context/AuthzContext";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
      {"Design & Developed by Software Group © "}
      {new Date().getFullYear()}
    </Typography>
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

    console.log("Full login response:", response);

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

      console.log("Logged user:", user);
      console.log("Owner type:", ownerType);

      if (ownerType === "DOG_BREEDER") {
        navigate(`/${DOG_BREEDER_REGISTER_PATH}`);
        return;
      }

      if (ownerType === "PET_SHOP") {
        navigate(`/${PET_SHOP_REGISTER_PATH}`);
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%)",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "#1f2937",
              mb: 0.5,
              fontSize: { xs: "1.7rem", sm: "2rem" },
              userSelect: "none",
            }}
          >
            KELTRON ADMIN LTE
          </Typography>

          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Administration Portal
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 2,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardHeader
            title="Sign In"
            subheader="Use your username and password"
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
                sx={{
                  mt: 3,
                  mb: 1,
                  textTransform: "none",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                  },
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <Button
                component={RouterLink}
                to={`/${PET_SHOP_OWNER_SIGNUP_PATH}`}
                fullWidth
                variant="outlined"
                startIcon={<PersonAddAlt1Icon />}
                sx={{
                  mb: 2,
                  textTransform: "none",
                  borderColor: "#2563eb",
                  color: "#2563eb",
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
                  mb: 2,
                  textTransform: "none",
                  borderColor: "#2563eb",
                  color: "#2563eb",
                }}
              >
                Register as Dog Breeder
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" align="center" sx={{ mt: 2, color: "#6b7280" }}>
          New applicant?{" "}
          <Link component={RouterLink} to={`/${PET_SHOP_OWNER_SIGNUP_PATH}`}>
            Create an owner account
          </Link>{" "}
          to apply online.
        </Typography>

        <Copyright />
      </Container>
    </Box>
  );
};

export default LoginPage;