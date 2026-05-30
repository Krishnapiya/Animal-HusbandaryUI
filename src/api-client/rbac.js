import {
  addItem,
  getItemByID,
  getItemList,
} from "./apiCall";
import { callApi } from "./client";
import { getHeader } from "../utils";
import {
  ADMIN_ACTIONS_API_URL,
  ADMIN_MENUS_API_URL,
  ADMIN_MODULES_API_URL,
  ADMIN_ROLE_PERMISSIONS_API_URL,
  ADMIN_ROLES_API_URL,
  ME_NAVIGATION_API_URL,
  ME_PERMISSIONS_API_URL,
} from "../config/endpoints";

export const getMyNavigation = async () => getItemByID(ME_NAVIGATION_API_URL);
export const getMyPermissions = async () => getItemByID(ME_PERMISSIONS_API_URL);

export const listModules = async () => getItemList(ADMIN_MODULES_API_URL);
export const createModule = async (data) => addItem(ADMIN_MODULES_API_URL, data);

export const listMenus = async () => getItemList(ADMIN_MENUS_API_URL);
export const createMenu = async (data) => addItem(ADMIN_MENUS_API_URL, data);

const patchAdminResource = async (url, data) => {
  const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;
  return await callApi({
    method: "PATCH",
    baseURL: BASE_API_URL,
    url,
    data,
    headers: {
      "Content-Type": "application/json",
      ...(getHeader() || {}),
    },
  });
};

export const updateModule = async (id, data) =>
  patchAdminResource(`${ADMIN_MODULES_API_URL}/${id}`, data);
export const updateMenu = async (id, data) =>
  patchAdminResource(`${ADMIN_MENUS_API_URL}/${id}`, data);

export const listRoles = async () => getItemList(ADMIN_ROLES_API_URL);
export const listActions = async () => getItemList(ADMIN_ACTIONS_API_URL);

export const getRolePermissions = async (roleId) =>
  getItemByID(ADMIN_ROLE_PERMISSIONS_API_URL(roleId));

/** Uses PUT (server also accepts PATCH) — avoids some proxies/clients that mishandle PATCH. */
export const saveRolePermissions = async (roleId, payload) => {
  const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;
  return await callApi({
    method: "PUT",
    baseURL: BASE_API_URL,
    url: ADMIN_ROLE_PERMISSIONS_API_URL(roleId),
    data: payload,
    headers: {
      "Content-Type": "application/json",
      ...(getHeader() || {}),
    },
  });
};
