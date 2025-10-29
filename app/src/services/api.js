import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = {
  // Create session
  createSession: async (name, email, phone) => {
    const response = await axios.post(`${API_BASE}/api/v1/session/create`, {
      user_name: name,
      user_email: email,
      user_phone: phone || null
    });
    return response.data;
  },

  // Send chat message
  sendMessage: async (sessionId, message) => {
    const response = await axios.post(`${API_BASE}/api/v1/chat/message`, {
      session_id: sessionId,
      message: message
    });
    return response.data;
  },

  // End session
  endSession: async (sessionId) => {
    const response = await axios.post(`${API_BASE}/api/v1/session/${sessionId}/end`);
    return response.data;
  }
};

export default api;

