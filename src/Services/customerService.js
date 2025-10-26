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

export async function importCustomersData(formData) {
  try {
    console.log("Uploading formData:", formData.get("file"));

    const res = await fetch(`${BASE_URL}${ENDPOINTS.IMPORTCUSTOMERSDATA}`, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("Response JSON:", data);

    if (!res.ok) throw new Error(data?.message || "Failed to import customers");

    return data;
  } catch (error) {
    console.error("Error importing customers:", error);
    throw error;
  }
};
