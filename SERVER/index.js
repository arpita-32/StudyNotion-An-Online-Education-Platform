const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const chatbotRoutes = require('./routes/chatbot');


dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: ["http://localhost:3000","https://study-notion-an-online-education-platform-azure.vercel.app"],
	credentials: true
  }));

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1chatbot", chatbotRoutes);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

const server = app.listen(PORT, () => {
  const actualPort = server.address().port;
  console.log(`✅ Server running at: http://localhost:${actualPort}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${PORT} is already in use. Trying another port...`);
    const newServer = app.listen(0, () => {
      const newPort = newServer.address().port;
      console.log(`✅ Server started successfully at: http://localhost:${newPort}`);
    });
  } else {
    console.error('❌ Server failed to start:', err);
  }
});

