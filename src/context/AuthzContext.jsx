import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SecurityIcon from "@mui/icons-material/Security";
import { encryptStorage, getUserAttributes } from "../utils";
import { getMyNavigation, getMyPermissions } from "../api-client/rbac";
import { RBAC_ADMIN_PATH } from "../config/routes";

const AuthzContext = createContext(null);

const defaultNavigation = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
];

const normalizeList = (response) => {
  if (!response?.isSuccess) return [];
  const data = response.data?.payLoad ?? response.data?.payload ?? response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

/** Lowercase menu and action keys so UI checks match backend @RequirePermission (e.g. designation vs Designation). */
const normalizePermissionMap = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out = {};
  for (const [menuKey, actions] of Object.entries(raw)) {
    if (!actions || typeof actions !== "object" || Array.isArray(actions)) {
      continue;
    }
    const inner = {};
    for (const [actionKey, allowed] of Object.entries(actions)) {
      inner[String(actionKey).toLowerCase()] = allowed;
    }
    out[String(menuKey).toLowerCase()] = inner;
  }
  return out;
};

const toToolpadNav = (items) =>
  items.map((item) => {
    const navItem = {
      segment: item.segment || item.path || item.slug || "",
      title: item.title || item.name || item.label || "Menu",
      icon: <AppRegistrationIcon />,
    };
    if (Array.isArray(item.children) && item.children.length > 0) {
      navItem.children = toToolpadNav(item.children);
    }
    return navItem;
  });

const moduleKey = (m) => String(m?.segment ?? m?.slug ?? m?.title ?? "");

const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const hasAdminRole = (user) => {
  const fromUser =
    user?.role?.roleName ||
    user?.roleName ||
    user?.role ||
    (Array.isArray(user?.roles) ? user.roles : null);

  if (typeof fromUser === "string" && fromUser.toUpperCase() === "ADMIN") {
    return true;
  }
  if (Array.isArray(fromUser) && fromUser.some((r) => String(r).toUpperCase() === "ADMIN")) {
    return true;
  }

  const auth = encryptStorage.getItem("userAuthDetails");
  if (!auth) return false;
  try {
    const token = JSON.parse(auth)?.token;
    const payload = parseJwtPayload(token);
    const role = payload?.role;
    const roles = Array.isArray(payload?.roles) ? payload.roles : [];
    if (String(role || "").toUpperCase() === "ADMIN") {
      return true;
    }
    return roles.some((r) => String(r).toUpperCase() === "ADMIN");
  } catch {
    return false;
  }
};

/** Sidebar nav: Dashboard + menus for active module + optional RBAC admin item. */
const buildSidebarNavigation = (modules, activeKey, includeAccessControl) => {
  const dash = { title: "Dashboard", icon: <DashboardIcon /> };
  const accessControlItem = includeAccessControl
    ? [{ segment: RBAC_ADMIN_PATH, title: "Access Control", icon: <SecurityIcon /> }]
    : [];

  if (!modules.length) {
    return [dash, ...accessControlItem];
  }
  const key =
    activeKey != null && activeKey !== ""
      ? activeKey
      : moduleKey(modules[0]);
  const mod =
    modules.find((m) => moduleKey(m) === key) || modules[0];
  const children = mod?.children || [];
  const menuItems = toToolpadNav(children);
  return [dash, ...menuItems, ...accessControlItem];
};

export const AuthzProvider = ({ children }) => {
  const [navigation, setNavigation] = useState(defaultNavigation);
  /** Top bar: API module groups (each has title, segment/slug, children). */
  const [apiNavModules, setApiNavModules] = useState([]);
  const [activeModuleSegment, setActiveModuleSegment] = useState(null);
  const [permissionMap, setPermissionMap] = useState({});
  const [isAuthzLoading, setIsAuthzLoading] = useState(false);

  useEffect(() => {
    const user = getUserAttributes();
    const includeAccessControl =
      Boolean(permissionMap?.[RBAC_ADMIN_PATH]?.list) || hasAdminRole(user);
    setNavigation(buildSidebarNavigation(apiNavModules, activeModuleSegment, includeAccessControl));
  }, [apiNavModules, activeModuleSegment, permissionMap]);

  const refreshAuthz = async () => {
    const user = getUserAttributes();
    if (!user) {
      setApiNavModules([]);
      setActiveModuleSegment(null);
      setNavigation(defaultNavigation);
      setPermissionMap({});
      return;
    }

    setIsAuthzLoading(true);
    try {
      const [navResponse, permissionResponse] = await Promise.all([
        getMyNavigation(),
        getMyPermissions(),
      ]);

      const navItems = normalizeList(navResponse);
      if (navItems.length > 0) {
        setApiNavModules(navItems);
        setActiveModuleSegment(moduleKey(navItems[0]) || null);
      } else {
        setApiNavModules([]);
        setActiveModuleSegment(null);
        setNavigation(defaultNavigation);
      }

      if (permissionResponse?.isSuccess) {
        const data =
          permissionResponse.data?.payLoad ??
          permissionResponse.data?.payload ??
          permissionResponse.data ??
          {};
        setPermissionMap(normalizePermissionMap(data));
      } else {
        setPermissionMap({});
      }
    } catch (error) {
      console.error("Failed to load authz metadata", error);
      setApiNavModules([]);
      setActiveModuleSegment(null);
      setNavigation(defaultNavigation);
      setPermissionMap({});
    } finally {
      setIsAuthzLoading(false);
    }
  };

  useEffect(() => {
    refreshAuthz();
  }, []);

  const can = useCallback((menuKey, action) => {
    const user = getUserAttributes();
    if (hasAdminRole(user)) {
      return true;
    }
    if (!menuKey || !action) return false;
    const mk = String(menuKey).toLowerCase();
    const menuPermissions = permissionMap?.[mk];
    if (!menuPermissions) return false;
    return Boolean(menuPermissions?.[String(action).toLowerCase()]);
  }, [permissionMap]);

  const value = useMemo(
    () => ({
      navigation,
      apiNavModules,
      activeModuleSegment,
      setActiveModuleSegment,
      permissionMap,
      isAuthzLoading,
      refreshAuthz,
      can,
    }),
    [
      navigation,
      apiNavModules,
      activeModuleSegment,
      permissionMap,
      isAuthzLoading,
      can,
    ],
  );

  return <AuthzContext.Provider value={value}>{children}</AuthzContext.Provider>;
};

export const useAuthz = () => {
  const context = useContext(AuthzContext);
  if (!context) {
    throw new Error("useAuthz must be used within AuthzProvider");
  }
  return context;
};

AuthzProvider.propTypes = {
  children: PropTypes.node,
};
