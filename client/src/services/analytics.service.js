import { api } from "./api.js";

export const analyticsService = {
  async overview() {
    const { data } = await api.get("/analytics/overview");
    return data.stats;
  },
  async revenueMonthly() {
    const { data } = await api.get("/analytics/revenue-monthly");
    return data.points;
  }
};