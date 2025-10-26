import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getProducts(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETALLPRODUCTS}`, {
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

export async function createProduct(token, productData) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.CREATEPRODUCTS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteProduct(token, productId) {
  try {
    const payload = { id: productId };
    console.log(payload);

    const res = await fetch(`${BASE_URL}${ENDPOINTS.DELETEPRODUCTS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function importproducts(formData) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.IMPORTPRODUCTS}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to import products");

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
