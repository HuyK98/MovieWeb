import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getMessages = async (userId) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/chat/messages/${userId}`);
  return data;
};

export const sendMessageAPI = async (message) => {
  const { data } = await axios.post(`${API_BASE_URL}/api/chat/messages`, message);
  return data;
};

export const uploadImageAPI = async (formData) => {
  const { data } = await axios.post(
    `${API_BASE_URL}/api/chat/upload`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }
  );
  return data;
};