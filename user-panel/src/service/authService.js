import api from "@/utils/axiosInstant"

export const login = async (payload) => {
  try {
    const res = await api.post("/user/login", payload);
    return res.data;   // ✅ pura response return karo
  } catch (error) {
    throw error;
  }
};

export const register = async (payload) => {
  const res = await api.post("/user/register", payload);
  return res.data;
};