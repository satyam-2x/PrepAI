import API from "../api";

// --- Resume Upload ---

// Upload resume file
export const uploadResume = (formData) => {
  return API.post("/api/interview/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// --- Interview Questions ---

// Generate interview questions
export const generateQuestions = (data) => {
  return API.post("/api/interview/generate", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// --- Feedback ---

// Generate interview feedback
export const getFeedback = (data) => {
  return API.post("/api/interview/feedback", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Save interview answers
export const saveAnswers = (data) => {
  return API.put("/api/interview/save-answers", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// --- Interview History ---

// Get all interviews
export const getAllInterviews = () => {
  return API.get("/api/interview/interviews", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Get interview by ID
export const getInterviewById = (id) => {
  return API.get(`/api/interview/interviews/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

