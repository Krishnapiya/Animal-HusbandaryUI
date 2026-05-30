/*eslint-disable*/
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { getUserAttributes } from "../../utils";
const UserTitle = () => {
  const userAttributes = getUserAttributes();
  return (
    <Chip
      sx={{
        // display: { xs: "none", md: "block" },
        // padding: 1,
        marginRight: 1,
        marginTop: 0.5,
        // fontSize: 16,
        color: "white",
      }}
      // label="Admin Trivandrum"
      label={
        <>
          <Box>
            Always Visible
            {/* {userAttributes["first_name"]} - {userAttributes["pen_number"]} */}
            {/* Hidden on Small Screens (xs) and Visible on md+ */}
            {/* <Box
              sx={{ display: { xs: "none", md: "inline" }, fontSize: "0.8rem" }}
            >
              | {userAttributes["office"]} | {userAttributes["office_type"]}
            </Box> */}
          </Box>
        </>
      }
      variant="outlined"
    />
  );
};

export default UserTitle;
