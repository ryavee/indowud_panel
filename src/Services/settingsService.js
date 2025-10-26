import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function loadSettings() {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.LOADSETTINGS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error loading settings:", error);
    throw error;
  }
}

export async function updateRequestUsers(emailArray) {
  try {
    const payload = { requestTo: emailArray };
    const response = await fetch(`${BASE_URL}${ENDPOINTS.UPDATEREQUESTUSERS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating request users:", error);
    throw error;
  }
}

export async function updateRatioRedemptionLimit(
  ratioValue,
  redemptionLimitValue
) {
  try {
    const payload = { ratio: ratioValue, limit: redemptionLimitValue };
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.UPDATERATIOREDEMPTIONLIMIT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

// delete request user
export async function removeRequestUsers(emailValue) {
  try {
    const payload = { email: emailValue };
    const response = await fetch(`${BASE_URL}${ENDPOINTS.REMOVEREQUESTUSERS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing request users:", error);
    throw error;
  }
}

export async function updateRefferalPoint(points) {
  try {
    console.log("Updating referral points, payload:", points);

    const payload = { points: points };
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.UPDATEREFERRALPOINTS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("Raw fetch response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch failed with status:", response.status, "message:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Response JSON:", data);
    return data;
  } catch (error) {
    console.error("Error updating referral point:", error);
    throw error;
  }
}
