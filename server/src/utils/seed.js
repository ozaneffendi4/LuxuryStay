import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Settings from "../models/Settings.js";

async function seed() {
  await connectDB(process.env.MONGO_URI);

  await Promise.all([User.deleteMany({}), Room.deleteMany({}), Settings.deleteMany({})]);

  const mk = async (name, email, role, password = "Password123") => {
    const passwordHash = await bcrypt.hash(password, 12);
    return User.create({ name, email, passwordHash, role });
  };

  const admin = await mk("Admin", "admin@luxurystay.com", "admin");
  await mk("Manager", "manager@luxurystay.com", "manager");
  await mk("Staff", "staff@luxurystay.com", "staff");

  await Settings.create({ taxPercent: 5, discountPercent: 10, currency: "PKR", hotelPolicies: "Check-in 2 PM, Check-out 12 PM." });

  await Room.insertMany([
    {
      title: "Deluxe King Suite",
      category: "Suite",
      description: "Spacious suite with city view.",
      pricePerNight: 18000,
      images: ["https://images.unsplash.com/photo-1560067174-8943bd1d6f14"],
      amenities: ["WiFi", "Breakfast", "AC", "TV"],
      status: "available",
      capacity: 2
    },
    {
      title: "Executive Twin Room",
      category: "Executive",
      description: "Perfect for business travelers.",
      pricePerNight: 12000,
      images: ["https://images.unsplash.com/photo-1505693314120-0d443867891c"],
      amenities: ["WiFi", "Desk", "AC"],
      status: "available",
      capacity: 2
    },
    {
      title: "Family Room",
      category: "Family",
      description: "Comfortable room for families.",
      pricePerNight: 15000,
      images: ["https://images.unsplash.com/photo-1505692952047-1a78307da8f2"],
      amenities: ["WiFi", "Extra Beds", "AC"],
      status: "available",
      capacity: 4
    }
  ]);

  console.log("✅ Seed complete.");
  console.log("Admin: admin@luxurystay.com / Password123");
  console.log("Manager: manager@luxurystay.com / Password123");
  console.log("Staff: staff@luxurystay.com / Password123");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
await Room.collection.dropIndexes().catch(() => {});