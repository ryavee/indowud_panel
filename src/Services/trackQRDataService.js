import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export const getAllQRData = async (token, page) => {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.GETALLQRDATA}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ page }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch QR data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching QR data:", error);
    throw error;
  }
};
