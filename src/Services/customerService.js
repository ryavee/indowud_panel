import { BASE_URL, ENDPOINTS } from "../Config/apiConfig";
export async function getCustomers(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETCUSTOMERS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Block User
export async function blockCustomer(token, uid, isUserInActive) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.BLOCKCUSTOMER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid, isUserInActive }),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// KYC Verification
export async function customerKYCVerification(token, uid, isKYCverifed) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.KYCVERIFICATION}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid, isKYCverifed }),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Send Customer Notification
export async function sendCustomerNotification(uid, message) {
  try {
    const res = await fetch(
      `${BASE_URL}${ENDPOINTS.SENDCUSTOMERNOTIFICATION}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, message }),
      }
    );
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Import Customers Data
export async function importCustomersData(formData) {
  try {
    console.log("Uploading formData:", formData.get("file")); // log the file

    const res = await fetch(`${BASE_URL}${ENDPOINTS.IMPORTCUSTOMERSDATA}`, {
      method: "POST",
      body: formData, // do NOT set Content-Type, browser handles it
    });

    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("Response JSON:", data);

    if (!res.ok) throw new Error(data?.message || "Failed to import customers");

    return data; // return API response
  } catch (error) {
    console.error("Error importing customers:", error);
    throw error;
  }
}
