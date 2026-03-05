import { api } from "./api.js";

export const logService = {
  async list() {
    const { data } = await api.get("/logs");
    return data.logs;
  }
};