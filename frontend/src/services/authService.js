import axios from "axios";

const API_URL = "http://https://volunteer-hub-jp64.onrender.com/api/auth";

const registerUser = (user) => {
  return axios.post(`${API_URL}/register`, user);
};

const loginUser = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export default {
  registerUser,
  loginUser,
};
