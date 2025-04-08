import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Backend Spring Boot

export const getCountries = async () => {
  const response = await axios.get(`${API_URL}/countries`);
  return response.data;
};

export const getScores = async () => {
  const response = await axios.get(`${API_URL}/scores`);
  return response.data;
};

export const saveScore = async (playerName, points) => {
  await axios.post(`${API_URL}/scores`, { playerName, points });
};
