export const BASE_URL =
  // "http://localhost:2000";
  "https://indowud-main-engine.onrender.com";
export const ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  GETUSERDATA: "/api/v1/auth/users/:uid",
  // REDEEM
  GETALLREDEEM: "/api/v2/redeem/manage-redemption",
  CHANGEREDAMPTIONSTATUS: "/api/v2/redeem/change-redemption-status",
  // USERS
  GETUSERS: "/api/v4/users/all-users",
  CREATEUSER: "/api/v4/users/create-new-user",
  UPDATEUSER: "/api/v4/users/update-user",
  DELETEUSER: "/api/v4/users/delete-user",
  IMPORTUSERSDATA: "/api/v4/users/upload-user",
  // CUSTOMERS
  GETCUSTOMERS: "/api/v5/customers/get-all-customers",
  BLOCKCUSTOMER: "/api/v5/customers/block-unblock-customer",
  KYCVERIFICATION: "/api/v5/customers/kyc-verification",
  SENDCUSTOMERNOTIFICATION: "/api/v5/customers/send-customer-notification",
  IMPORTCUSTOMERSDATA: "/api/v5/customers/import-customers",
  // Announcement
  GETANNOUNCEMENTS: "/api/v6/announcements/get-all-announcements",
  CREATEANNOUNCEMENT: "/api/v6/announcements/create-new-announcement",
  DELETEANNOUNCEMENT: "/api/v6/announcements/delete-announcement",
  // Settings
  LOADSETTINGS: "/api/v3/settings/load-settings",
  UPDATEREQUESTUSERS: "/api/v3/settings/request-to-users",
  UPDATERATIOREDEMPTIONLIMIT: "/api/v3/settings/change-limit-ratio",
  REMOVEREQUESTUSERS: "/api/v3/settings/delete-request-user",
  UPDATEREFERRALPOINTS: "/api/v3/settings/user-referral-points",
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
  UPDATEPRODUCTS: "/api/v10/products/update-product",
  IMPORTPRODUCTS: "/api/v10/products/import-products",

  // GENERATE QR
  GENERATEQR: "/api/v11/qrCodes/generate-qr-code",
  GETALLBATCHES: "/api/v11/qrCodes/all-batches",
  GETBATCHBYID: "/api/v11/qrCodes/get-batch-by-id",
  // DEALERS
  GETALLDEALERS: "/api/v12/dealers/get-dealers",
  CREATENEWDEALER: "/api/v12/dealers/create-new-dealer",
  DELETEDEALER: "/api/v12/dealers/delete-dealer",
  GENERATEDEALERID: "/api/v12/dealers/generate-dealer-id",
  IMPORTDEALERSDATA: "/api/v12/dealers/import-dealers",
  // TRACK QR
  GETALLQRDATA: "/api/v11/qrCodes/all-qr-codes",
  // CATALOGUE
  GETALLCATALOGUES: "/api/v13/catalogs/get-all-catalogs",
  CREATECATALOGUE: "/api/v13/catalogs/create-new-catalog",
  DELETECATALOGUE: "/api/v13/catalogs/delete-catalog",
};
