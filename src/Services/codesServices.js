import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

// generate QR

// getall batchs
export async function getAllBatches(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETALLBATCHES}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Batchs data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

// get batch by id
export async function getBatchById(token, id) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETBATCHBYID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ batchId: id }),
    });
    if (!res.ok) throw new Error("Batch data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateQR(token, qrData) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GENERATEQR}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(qrData),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log("Api error :", error);
    return null;
  }
}
