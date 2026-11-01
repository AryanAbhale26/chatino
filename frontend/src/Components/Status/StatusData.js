// Status Data & Local Persistence for WhatsApp-like stories

const MY_STATUS_KEY = "chattingo_my_stories";
const CONTACT_STATUS_KEY = "chattingo_contact_stories";

export const getMyStatuses = () => {
  try {
    const raw = localStorage.getItem(MY_STATUS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to load my stories", e);
  }
  return [];
};

export const addMyStatus = ({ image, caption }) => {
  const current = getMyStatuses();
  const newStory = {
    id: Date.now().toString(),
    image,
    caption: caption || "",
    timestamp: "Just now",
    createdAt: new Date().toISOString(),
  };
  const updated = [newStory, ...current];
  try {
    localStorage.setItem(MY_STATUS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save story to localStorage", e);
  }
  return updated;
};

export const clearMyStatuses = () => {
  localStorage.removeItem(MY_STATUS_KEY);
};

export const getContactStatuses = () => {
  try {
    const raw = localStorage.getItem(CONTACT_STATUS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to load contact stories", e);
  }
  return [];
};

export const getAllContactStatuses = (reqUser, contacts = []) => {
  // Only return actual status updates stored in state/localStorage
  const savedContactStatuses = getContactStatuses();
  return savedContactStatuses;
};

export const getStatusByUserId = (userId, reqUser, contacts = []) => {
  if (userId === "my_status") {
    const myStories = getMyStatuses();
    return {
      userId: "my_status",
      userName: reqUser?.name || "My Status",
      userAvatar: reqUser?.profile,
      updatedAt: myStories[0]?.timestamp || "No updates",
      stories: myStories,
    };
  }

  const all = getAllContactStatuses(reqUser, contacts);
  const found = all.find((item) => String(item.userId) === String(userId));
  if (found) return found;

  return null;
};
