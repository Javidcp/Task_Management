import api from "./instance";

export const login = async (data) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
};

export const registering = async (data) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
};

export const logout = async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
};