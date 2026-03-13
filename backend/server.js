const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend directory so the app works over ngrok / LAN
app.use("/frontend", express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => res.redirect("/frontend/login.html"));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/patients", require("./routes/patientRoutes"));

app.use("/api/symptoms", require("./routes/symptomRoutes"));

app.use("/api/reports", require("./routes/reportRoutes"));

app.use("/api/ai", require("./routes/aiRoutes"));

app.use("/api/referrals", require("./routes/referralRoutes"));

app.use("/api/hospitals", require("./routes/hospitalRoutes"));

app.use("/api/sync", require("./routes/syncRoutes"));

app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/share", require("./routes/shareRoutes"));
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
