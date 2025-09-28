export const BASE_URL =
  // "http://localhost:2000";
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
  // Tickets
  LOADALLTICKETS: "/api/v7/tickets/all-tickets",
  CHANGETICKETSTATUS: "/api/v7/tickets/change-tickets-status",
  // FEED
  GETALLFEEDS: "/api/v8/feeds/get-all-feeds",
  CREATEFEED: "/api/v8/feeds/create-new-feed",
  UPDATEFEED: "/api/v8/feeds/update-feed",
  DELETEFEED: "/api/v8/feeds/delete-feed",
  // Promotional
  GETALLPROMOTIONS: "/api/v9/promotional/get-all-promotionals",
  CREATENEWPROMOTIONS: "/api/v9/promotional/create-new-promotional",
  UPDATEPROMOTIONS: "/api/v9/promotional/update-promotional",
  DELETEPROMOTIONS: "/api/v9/promotional/delete-promotional",
  // Products
  GETALLPRODUCTS: "/api/v10/products/all-products",
  CREATEPRODUCTS: "/api/v10/products/create-new-product",
  DELETEPRODUCTS: "/api/v10/products/delete-product",
};
