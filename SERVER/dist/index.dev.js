"use strict";

var express = require("express");

var app = express();

var userRoutes = require("./routes/User");

var profileRoutes = require("./routes/Profile");

var paymentRoutes = require("./routes/Payments");

var courseRoutes = require("./routes/Course");

var database = require("./config/database");

var cookieParser = require("cookie-parser");

var cors = require("cors");

var _require = require("./config/cloudinary"),
    cloudinaryConnect = _require.cloudinaryConnect;

var fileUpload = require("express-fileUpload");

var dotenv = require("dotenv");

dotenv.config();
var PORT = process.env.PORT || 4000;
database.connect();
app.use(express.json());
app.use(cookieParser);
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
}));
cloudinaryConnect();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.get("/", function (req, res) {
  return res.json({
    success: true,
    message: 'your server is up and running'
  });
});
app.listen(PORT, function () {
  console.log("App is running at ".concat(PORT));
});
//# sourceMappingURL=index.dev.js.map
