import { addItem, getItemByID } from "./apiCall";
import {
  USER_ASSIGNED_ROLES_URL,
  USER_ASSIGN_ROLES_URL,
  USER_ROLE_ASSIGNMENTS_URL,
} from "../config/endpoints";

export const getAssignedRoles = async (userId) =>
  getItemByID(USER_ASSIGNED_ROLES_URL(userId));

export const assignRoles = async (userId, body) => addItem(USER_ASSIGN_ROLES_URL(userId), body);

export const getUserRoleAssignments = async () =>
  getItemByID(USER_ROLE_ASSIGNMENTS_URL);
