import axios from "axios";

const API_MOVIES_URL = "http://localhost:5000/api/movies";
const API_USERS_URL = "http://localhost:5000/api/users";
const API_MEMBER_CARD_URL = "http://localhost:5000/api/member-card"; // URL cho member card

// Lấy danh sách phim
export const getMovies = async () => {
  const response = await axios.get(API_MOVIES_URL);
  return response.data;
};

// Thêm phim mới
export const addMovie = async (movie) => {
  const response = await axios.post(API_MOVIES_URL, movie);
  return response.data;
};

// Lấy thông tin user
export const getUserProfile = async () => {
  const response = await axios.get(`${API_USERS_URL}/profile`);
  return response.data;
};

// Cập nhật thông tin user
export const updateProfile = async (formData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_USERS_URL}/profile`, formData, config);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    throw error;
  }
};

// Lấy thông tin member card
export const getMemberCard = async () => {
  try {
    const response = await axios.get(API_MEMBER_CARD_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy thông tin member card:", error);
    throw error;
  }
};