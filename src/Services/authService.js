import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";
export async function loginToAdminPortal(email, password) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    return res.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getUserData(uid, token) {
  try {
    const res = await fetch(
      `${BASE_URL}${ENDPOINTS.GETUSERDATA.replace(":uid", uid)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function apiRequest(url, method = "GET", token, body = null) {}
