"use strict";

var express = require("express");

var app = express();

require("dotenv").config(); // Import routes and configurations


var userRoutes = require("./routes/User");

var profileRoutes = require("./routes/Profile");

var paymentRoutes = require("./routes/Payments");

var courseRoutes = require("./routes/Course");

var contactUsRoute = require("./routes/Contact");

var database = require("./config/database");

var _require = require("./config/cloudinary"),
    cloudinaryConnect = _require.cloudinaryConnect;

var _require2 = require('./controllers/Payment'),
    verifySignature = _require2.verifySignature; // Middleware


var cookieParser = require("cookie-parser");

var cors = require("cors");

var fileUpload = require("express-fileupload");

var PORT = process.env.PORT || 4000; // Database connection

database.connect(); // Middleware setup

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
})); // File upload configuration

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
})); // Cloudinary connection

cloudinaryConnect(); // Special route for Stripe webhook - must be before express.json()

app.post('/api/v1/payment/verifysignature', express.raw({
  type: 'application/json'
}), verifySignature); // Body parser middleware

app.use(express.json()); // Routes

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute); // Default route

app.get("/", function (req, res) {
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
}); // Error handling middleware

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!"
  });
}); // Start server

app.listen(PORT, function () {
  console.log("App is running at ".concat(PORT));
});
module.exports = app;
//# sourceMappingURL=index.dev.js.map
