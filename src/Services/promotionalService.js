import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getAllPromotions() {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETALLPROMOTIONS}`, {
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

export async function createNewPromotion(promotionData) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.CREATENEWPROMOTIONS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promotionData),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updatePromotion(id, promotionData) {
  try {
    const dataWithId = {
      id: id,
      ...promotionData,
    };
    const res = await fetch(`${BASE_URL}${ENDPOINTS.UPDATEPROMOTIONS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataWithId),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to update promotion: ${res.status} ${res.statusText} - ${errorText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Error in updatePromotion:", error);
    throw error;
  }
}

export async function deletePromotion(id) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.DELETEPROMOTIONS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to delete promotion: ${res.status} ${res.statusText} - ${errorText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Error in deletePromotion:", error);
    throw error;
  }
}



export async function importpromotional(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}${ENDPOINTS.IMPORTPROMOTIONALDATA}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
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
