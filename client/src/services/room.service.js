import { api } from "./api.js";

export const roomService = {
  async list(params) {
    const { data } = await api.get("/rooms", { params });
    return data.rooms;
  },
  async create(payload) {
    const { data } = await api.post("/rooms", payload);
    return data.room;
  },
  async update(id, payload) {
    const { data } = await api.put(`/rooms/${id}`, payload);
    return data.room;
  },
  async remove(id) {
    const { data } = await api.delete(`/rooms/${id}`);
    return data;
  }
};