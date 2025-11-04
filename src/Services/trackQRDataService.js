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

export async function searchQRByBatch(query) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.SEARCHQRBYBATCH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error("QR search failed");
    return res.json();
  } catch (error) {
    console.error("API error:", error);
    return null;
  }
}
