import API from "../api";

// --- Profile ---

// Fetch user profile
export const getProfile = (token) =>
  API.get("/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Update user profile
export const updateProfile = (data, token) =>
  API.put("/api/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// --- Account ---

// Delete user account
export const deleteAccount = (data, token) =>
  API.delete("/api/profile", {
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Change user password
export const changePassword = (data, token) =>
  API.put("/api/profile/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
