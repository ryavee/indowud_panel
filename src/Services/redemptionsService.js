import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getRedemptions(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETALLREDEEM}`, {
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
    return null;
  }
}

export async function changeRedemptionStatus(token, id, uid, status) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.CHANGEREDAMPTIONSTATUS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id, uid: uid, status: status }),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
