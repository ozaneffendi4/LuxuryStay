import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function boot() {
  await connectDB(process.env.MONGO_URI);

  const app = createApp();
  app.listen(PORT, () => console.log(`✅ LuxuryStay server running on http://localhost:${PORT}`));
}

boot().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});