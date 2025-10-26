import { BASE_URL, ENDPOINTS } from "../Config/apiConfig";
export async function getDealers(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETALLDEALERS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Dealers data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createDealer(token, dealerData) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.CREATENEWDEALER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dealerData),
    });
    if (!res.ok) throw new Error("Create Dealer data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteDealer(token, id) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.DELETEDEALER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateDealerId() {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GENERATEDEALERID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("User data not found");
    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function importDealersData(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}${ENDPOINTS.IMPORTDEALERSDATA}`, {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!res.ok) {
      throw new Error(
        data.message || data.error || `HTTP error! status: ${res.status}`
      );
    }
    return data;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
}
