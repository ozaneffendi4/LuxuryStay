import { api } from "./api.js";

export const userService = {
  async list() {
    const { data } = await api.get("/users");
    return data.users;
  },
  async create(payload) {
    const { data } = await api.post("/users", payload);
    return data.user;
  },
  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data.user;
  },
  async remove(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  }
};