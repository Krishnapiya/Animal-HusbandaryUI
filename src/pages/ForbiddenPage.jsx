import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const ForbiddenPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1">
        You do not have permission to access this page.
      </Typography>
    </Box>
  );
};

export default ForbiddenPage;
