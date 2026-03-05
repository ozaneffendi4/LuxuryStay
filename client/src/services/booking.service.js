import { api } from "./api.js";

export const bookingService = {
  async searchAvailable(checkIn, checkOut) {
    const { data } = await api.get("/bookings/search", { params: { checkIn, checkOut } });
    return data.rooms;
  },
  async create(payload) {
    const { data } = await api.post("/bookings", payload);
    return data.booking;
  },
  async myBookings() {
    const { data } = await api.get("/bookings/mine");
    return data.bookings;
  },
  async listAll(params) {
    const { data } = await api.get("/bookings", { params });
    return data.bookings;
  },
  async approve(id) {
    const { data } = await api.post(`/bookings/${id}/approve`);
    return data.booking;
  },
  async cancel(id) {
    const { data } = await api.post(`/bookings/${id}/cancel`);
    return data.booking;
  },
  async checkIn(id) {
    const { data } = await api.post(`/bookings/${id}/checkin`);
    return data.booking;
  },
  async checkOut(id) {
    const { data } = await api.post(`/bookings/${id}/checkout`);
    return data.booking;
  }
};