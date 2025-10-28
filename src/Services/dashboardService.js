import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getDashboardData() {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.FETCHDASHBOARDDATA}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
