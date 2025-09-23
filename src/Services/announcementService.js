import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getAnnouncements(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETANNOUNCEMENTS}`, {
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

export async function createAnnouncement(token, newAnnouncement) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.CREATEANNOUNCEMENT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAnnouncement),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnnouncementFromAdmin(token, announcementId) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.DELETEANNOUNCEMENT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ announcementId }),
    });    
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log("Error deleting announcement:", error);
    throw error;
  }
}
