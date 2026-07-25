require("dotenv").config({ override: true });
const express = require("express");
const connectToDb = require("./utils/db");
const userRoute = require("./route/userRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const router = require("./route/productRoute");
const collectionRoute = require("./route/collectionRoute");
const cartRoute = require("./route/cartRoute");
const wishlistRoute = require("./route/wishlistRoute");
const orderRoute = require("./route/orderRoute");
const filerRoute = require("./route/filerRoute");
const contactRoute = require("./route/contactRoute");
const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL2,
  process.env.ADMIN_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3030",
  "http://localhost:3031",
  "http://localhost:3032",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Check if origin matches allowedOrigins or local/deployment domains
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com")
      ) {
        return callback(null, true);
      }

      // Safe fallback allowing the request origin
      return callback(null, origin);
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
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/order", orderRoute);
app.use("/api/filer", filerRoute);
app.use("/api/contact", contactRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server is running smoothly!",
  });
});


app.listen(port || 3000, async () => {
  try {
    await connectToDb();
    console.log(">>>Server is running >>>");
  } catch (error) {
    console.log("Error while running server >>>", error);
  }
});
