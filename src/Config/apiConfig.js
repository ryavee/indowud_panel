export const BASE_URL =
  //  "http://localhost:2000";
  "https://indowud-main-engine.onrender.com";
export const ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  GETUSERDATA: "/api/v1/auth/users/:uid",
  GETUSERS: "/api/v4/users/all-users",
  CREATEUSER: "/api/v4/users/create-new-user",
  UPDATEUSER: "/api/v4/users/update-user",
  DELETEUSER: "/api/v4/users/delete-user",
  GETCUSTOMERS: "/api/v5/customers/get-all-customers",
  BLOCKCUSTOMER: "/api/v5/customers/block-unblock-customer",
  KYCVERIFICATION: "/api/v5/customers/kyc-verification",
  // Announcement
  GETANNOUNCEMENTS: "/api/v6/announcements/get-all-announcements",
  CREATEANNOUNCEMENT: "/api/v6/announcements/create-new-announcement",
  DELETEANNOUNCEMENT: "/api/v6/announcements/delete-announcement",
  // Settings
  LOADSETTINGS: "/api/v3/settings/load-settings",
  UPDATEREQUESTUSERS: "/api/v3/settings/request-to-users",
  UPDATERATIOREDEMPTIONLIMIT: "/api/v3/settings/change-limit-ratio",
  REMOVEREQUESTUSERS: "/api/v3/settings/delete-request-user",
};
