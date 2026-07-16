const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./Model/userModel");
const dotenv = require("dotenv");
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB:", mongoose.connection.name);

  // Clean existing test users if they exist
  const emails = ["admin@test.com", "user1@test.com", "user2@test.com", "seller1@test.com", "seller2@test.com"];
  await User.deleteMany({ email: { $in: emails } });
  console.log("Cleaned old test users");

  const hashedUserPassword = await bcrypt.hash("user123", 10);
  const hashedSellerPassword = await bcrypt.hash("seller123", 10);

  await User.create({
    fullname: "Rakesh Sharma",
    email: "user1@test.com",
    phone: "9876543210",
    password: hashedUserPassword,
    role: "user"
  });
  console.log("Created Customer User 1");

  await User.create({
    fullname: "Amit Patel",
    email: "user2@test.com",
    phone: "9876543211",
    password: hashedUserPassword,
    role: "user"
  });
  console.log("Created Customer User 2");

  await User.create({
    fullname: "Super Electronics",
    email: "seller1@test.com",
    phone: "9876543212",
    password: hashedSellerPassword,
    role: "seller"
  });
  console.log("Created Seller 1");

  await User.create({
    fullname: "Apex Garments",
    email: "seller2@test.com",
    phone: "9876543213",
    password: hashedSellerPassword,
    role: "seller"
  });
  console.log("Created Seller 2");

  console.log("Seeding complete!");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
