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

export async function createUser(token, newUserData) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.CREATEUSER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUserData),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || data.error || `HTTP error! status: ${res.status}`
      );
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(token, updatedUserData) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.UPDATEUSER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUserData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || data.error || `HTTP error! status: ${res.status}`
      );
    }
    return data;
  } catch (error) {
    throw error;
  }
}
export async function deleteUser(token, uid) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.DELETEUSER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || data.error || `HTTP error! status: ${res.status}`
      );
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadUserData(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("📤 Uploading file:", file.name);

    const res = await fetch(`${BASE_URL}${ENDPOINTS.IMPORTUSERSDATA}`, {
      method: "POST",
      body: formData, // ✅ no headers needed for FormData
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

    console.log("✅ Upload response:", data);
    return data;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
}
