require("dotenv").config({ override: true });
const express = require("express");
const connectToDb = require("./utils/db");
const userRoute = require("./route/userRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const router = require("./route/productRoute");
const collectionRoute = require("./route/collectionRoute");
const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL2,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser())
const port = process.env.PORT;


// route
app.use("/api/user" , userRoute)
app.use("/api/product" , router)
app.use("/api/collection", collectionRoute);


app.listen(port || 3000, async () => {
  try {
    await connectToDb();
    console.log(">>>Server is running >>>");
  } catch (error) {
    console.log("Error while running server >>>", error);
  }
});
