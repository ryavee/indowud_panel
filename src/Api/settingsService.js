export async function loadSettings() {
  console.log("aPI CALLING");
  const response = await fetch(
    "https://indowud-main-engine.onrender.com/api/v3/settings/load-settings"
  );
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
}

export async function updateRequestUsers(updateUsersList) {
  console.log("Update Users Api Calling");
  const response = await fetch(
    "https://indowud-main-engine.onrender.com/api/v3/settings/request-to-users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUsersList),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
}
