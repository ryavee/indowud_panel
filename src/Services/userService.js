import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";
export async function getUsersList(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETUSERS}`, {
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
