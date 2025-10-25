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
