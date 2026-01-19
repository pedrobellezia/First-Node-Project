import axios from "axios";

const api = axios.create({
  baseURL: process.env.CND_API_URL,
});

export default api;
