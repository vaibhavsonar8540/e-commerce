require("dotenv").config();
const express = require("express");
const connectToDb = require("./utils/db");
const userRoute = require("./route/userRoute");
const cookieParser = require("cookie-parser");
const router = require("./route/productRoute");
const app = express();
app.use(express.json());
app.use(cookieParser())
const port = process.env.PORT;


// route
app.use("/api/user" , userRoute)
app.use("/api/product" , router)


app.listen(port || 3000, async () => {
  try {
    await connectToDb();
    console.log(">>>Server is running >>>");
  } catch (error) {
    console.log("Error while running server >>>", error);
  }
});
