import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

export async function getFeed(token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.GETALLFEEDS}`, {
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

export async function createFeed(feedData, token) {
  try {
    const formData = new FormData();
    formData.append("title", feedData.title);
    formData.append("description", feedData.description);
    formData.append("uid", feedData.uid);

    if (feedData.imageFile) {
      formData.append("imageFile", feedData.imageFile);
    }

    const res = await fetch(`${BASE_URL}${ENDPOINTS.CREATEFEED}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to create feed");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateFeed(feedId, feedData, originalFeedData, token) {
  try {
    const formData = new FormData();
    formData.append("feedId", feedId);

    let hasChanges = false;

    // Log what we're comparing
    console.log("Original feed data:", originalFeedData);
    console.log("New feed data:", feedData);

    // Check title change
    const titleChanged =
      feedData.title !== undefined &&
      feedData.title !== originalFeedData?.title;
    if (titleChanged) {
      formData.append("title", feedData.title);
      hasChanges = true;
      console.log(
        "Title changed from:",
        originalFeedData?.title,
        "to:",
        feedData.title
      );
    }

    // Check description change
    const descriptionChanged =
      feedData.description !== undefined &&
      feedData.description !== originalFeedData?.description;
    if (descriptionChanged) {
      formData.append("description", feedData.description);
      hasChanges = true;
      console.log(
        "Description changed from:",
        originalFeedData?.description,
        "to:",
        feedData.description
      );
    }

    // Check for new image file
    if (feedData.imageFile && feedData.imageFile instanceof File) {
      formData.append("imageFile", feedData.imageFile);
      hasChanges = true;
      console.log("New image file provided:", feedData.imageFile.name);
    }

    // Log what's being sent
    console.log("Changes detected:", {
      titleChanged,
      descriptionChanged,
      imageFile: !!feedData.imageFile,
    });

    // Log FormData entries for debugging
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key + ":", value);
    }

    // If no changes detected, return early
    if (!hasChanges) {
      console.log("No changes detected, skipping update");
      return { success: true, message: "No changes to update" };
    }

    console.log(`Making API call to update feed ${feedId}`);

    const res = await fetch(`${BASE_URL}${ENDPOINTS.UPDATEFEED}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server response:", res.status, errorText);
      throw new Error(`Failed to update feed: ${res.status} ${errorText}`);
    }

    const result = await res.json();
    console.log("Update successful:", result);
    return result;
  } catch (error) {
    console.error("Update feed error:", error);
    throw error; // Re-throw to let the context handle it
  }
}
export async function deleteFeed(feedId, token) {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.DELETEFEED}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feedId: feedId }),
    });
    if (!res.ok) throw new Error("Failed to delete feed");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
