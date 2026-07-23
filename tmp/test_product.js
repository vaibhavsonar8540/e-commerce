const path = require("path");
require("dotenv").config({ path: "c:\\Users\\Vaibhav Sonar\\Desktop\\My Projects\\e-commerce\\server\\.env", override: true });
const mongoose = require("mongoose");
const connectToDb = require("c:\\Users\\Vaibhav Sonar\\Desktop\\My Projects\\e-commerce\\server\\utils\\db");
const Product = require("c:\\Users\\Vaibhav Sonar\\Desktop\\My Projects\\e-commerce\\server\\Model\\productModel");

async function run() {
  try {
    await connectToDb();
    console.log("Connected to DB");
    const p = await Product.create({
      productName: "Test Product " + Date.now(),
      description: "Test description that is long enough",
      collections: new mongoose.Types.ObjectId(), // dummy ObjectId
      price: 100,
      stock: 10,
      thumbnail: "test.jpg",
      seller: new mongoose.Types.ObjectId(), // dummy ObjectId
    });
    console.log("Created successfully:", p);
  } catch (error) {
    console.error("Error thrown:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
