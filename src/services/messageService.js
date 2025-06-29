// src/services/messageService.js
import axios from "axios";

const API_URL = "https://buzzsway.netlify.app/api/messages";

export const saveGroupMessage = async (message) => {
  try {
    const res = await axios.post(`${API_URL}/group`, message);
    return res.data;
  } catch (error) {
    console.error("Error saving group message:", error);
  }
};

export const savePrivateMessage = async (message) => {
  try {
    const res = await axios.post(`${API_URL}/private`, message);
    return res.data;
  } catch (error) {
    console.error("Error saving private message:", error);
  }
};
