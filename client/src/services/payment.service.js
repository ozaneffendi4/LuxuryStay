import { api } from "./api.js";

export const paymentService = {
  async initiate(bookingId) {
    const { data } = await api.post("/payments/initiate", { bookingId });
    return data.payment;
  },
  async confirm(paymentId) {
    const { data } = await api.post("/payments/confirm", { paymentId });
    return data.payment;
  }
};