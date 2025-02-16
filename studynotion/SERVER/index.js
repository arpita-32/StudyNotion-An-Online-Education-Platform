const express = require("express");
const app = express();
require("dotenv").config();

// Import routes and configurations
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const { verifySignature } = require('./controllers/Payment');

// Middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// Database connection
database.connect();

// Middleware setup
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary connection
cloudinaryConnect();

// Special route for Stripe webhook - must be before express.json()
app.post('/api/v1/payment/verifysignature', express.raw({ type: 'application/json' }), verifySignature);

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

module.exports = app;