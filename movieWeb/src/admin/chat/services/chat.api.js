import axios from 'axios';
import API_URL from '../../../api/config';

export const getUsersWithLastMessage = () => axios.get(`${API_URL}/api/chat/users/last-message`);
export const getMessages = (userId) => axios.get(`${API_URL}/api/chat/messages/${userId}`);
export const sendMessageAPI = (payload) => axios.post(`${API_URL}/api/chat/messages`, payload);
export const uploadImageAPI = (formData) =>
  axios.post(`${API_URL}/api/chat/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
