/* eslint-disable */
import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import PinIcon from "@mui/icons-material/Pin";
import Divider from "@mui/material/Divider";

import { getUserAttributes } from "../../utils";
import useLogout from "../../hooks/useLogout";

const UserMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const userAttributes = getUserAttributes();
  const { handlelogout } = useLogout();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt={userAttributes?.full_name || userAttributes?.username || "User"}
            src=""
          />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu}>
          <ListItemIcon>
            <PinIcon fontSize="small" />
          </ListItemIcon>
          <Typography textAlign="center">Change Password</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handlelogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;