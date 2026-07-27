import { BASE_API_URL } from "./apiCall";
import { callApi } from "./client";
import { getHeader } from "../utils";

/**
 * Get all notifications
 */
export const getNotifications = () =>
  callApi({
    method: "GET",
    baseURL: BASE_API_URL,
    url: "/petshop/auth/notifications/list",
    headers: getHeader(),
  });

/**
 * Get unread notification count
 */
export const getUnreadCount = () =>
  callApi({
    method: "GET",
    baseURL: BASE_API_URL,
    url: "/petshop/auth/notifications/unread-count",
    headers: getHeader(),
  });

/**
 * Mark one notification as read
 */
export const markNotificationAsRead = (id) =>
  callApi({
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: `/petshop/auth/notifications/read/${id}`,
    headers: getHeader(),
  });

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = () =>
  callApi({
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: "/petshop/auth/notifications/read-all",
    headers: getHeader(),
  });