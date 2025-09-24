import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getTickets(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.LOADALLTICKETS}`, {
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

export async function changeTicketStatus(token, ticketId, status) {
  try {
    const payload = { ticketId: ticketId, status: status };
    console.log(payload);
    const res = await fetch(`${BASE_URL}${ENDPOINTS.CHANGETICKETSTATUS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    console.log(res);
    
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
