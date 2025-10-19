import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getAllCatalogues() {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETALLCATALOGUES}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch catalogues");
    return res.json();
  } catch (error) {
    console.error("Error fetching catalogues:", error);
    return null;
  }
}

export async function createCatalogue(token, catalogueData) {
  try {
    const formData = new FormData();
    formData.append("name", catalogueData.name);
    formData.append("hiname", catalogueData.hiname);
    if (catalogueData.pdf) {
      formData.append("pdf", catalogueData.pdf);
    }

    const res = await fetch(`${BASE_URL}${ENDPOINTS.CREATECATALOGUE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to create catalogue");
    return res.json();
  } catch (error) {
    console.error("Error creating catalogue:", error);
    return null;
  }
}

export async function deleteCatalogue(token, catalogueId) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.DELETECATALOGUE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: catalogueId }),
    });
    if (!res.ok) throw new Error("Failed to delete catalogue");
    return res.json();
  } catch (error) {
    console.error("Error deleting catalogue:", error);
    return null;
  }
}
