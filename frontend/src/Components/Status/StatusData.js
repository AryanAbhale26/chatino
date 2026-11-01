import { BASE_API_URL } from "../../config/api";

const MY_STATUS_CACHE_KEY = "chattingo_my_status_cache";

/**
 * Fetch current user's published statuses from database
 */
export const getMyStatuses = async (token) => {
  if (!token) return [];
  try {
    const res = await fetch(`${BASE_API_URL}/api/status/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (e) {
    console.error("Failed to fetch my statuses from backend", e);
  }
  return [];
};

/**
 * Post and save a new status to the backend database
 */
export const addMyStatus = async (token, { image, caption }) => {
  if (!token || !image) return [];
  try {
    const res = await fetch(`${BASE_API_URL}/api/status/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ image, caption }),
    });

    if (res.ok) {
      // Re-fetch current user's statuses
      return await getMyStatuses(token);
    }
  } catch (e) {
    console.error("Failed to publish status to backend", e);
  }
  return [];
};

/**
 * Fetch all recent statuses published by OTHER users (contacts)
 */
export const getAllContactStatuses = async (token) => {
  if (!token) return [];
  try {
    const res = await fetch(`${BASE_API_URL}/api/status/recent`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (e) {
    console.error("Failed to fetch contact statuses from backend", e);
  }
  return [];
};

/**
 * Get status data by user ID for the StatusViewer component
 */
export const getStatusByUserId = async (targetUserId, token, reqUser) => {
  const currentUserId = reqUser?.id ? String(reqUser.id) : null;
  const isMe =
    targetUserId === "my_status" ||
    targetUserId === "me" ||
    (currentUserId && String(targetUserId) === currentUserId);

  if (isMe) {
    const myStories = await getMyStatuses(token);
    return {
      userId: "my_status",
      userName: reqUser?.name || "My Status",
      userAvatar: reqUser?.profile,
      updatedAt: myStories[0]?.createdAt || "No updates",
      stories: myStories.map((s) => ({
        id: String(s.id),
        image: s.image,
        caption: s.caption || "",
        timestamp: s.createdAt,
      })),
    };
  }

  // Look in the contact statuses from backend
  const contacts = await getAllContactStatuses(token);
  const found = contacts.find((item) => String(item.userId) === String(targetUserId));
  if (found && found.stories && found.stories.length > 0) return found;

  // Fallback: fetch directly from /api/status/user/{userId}
  if (token && targetUserId && targetUserId !== "my_status") {
    try {
      const res = await fetch(`${BASE_API_URL}/api/status/user/${targetUserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const statuses = await res.json();
        if (Array.isArray(statuses) && statuses.length > 0) {
          const author = statuses[0].user;
          return {
            userId: String(targetUserId),
            userName: author?.name || "Contact",
            userAvatar: author?.profile,
            updatedAt: statuses[0].createdAt,
            stories: statuses.map((s) => ({
              id: String(s.id),
              image: s.image,
              caption: s.caption || "",
              timestamp: s.createdAt,
            })),
          };
        }
      }
    } catch (e) {
      console.error("Failed to fetch user status", e);
    }
  }

  return null;
};
