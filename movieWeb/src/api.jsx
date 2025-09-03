import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getMovies = async () => {
  const response = await axios.get(`${API_URL}/api/movies`);
  return response.data;
};

export const addMovie = async (movie) => {
  const response = await axios.post(`${API_URL}/api/movies`, movie);
  return response.data;
};
