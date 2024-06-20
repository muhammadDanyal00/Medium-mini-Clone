import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./utils/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";

dotenv.config({ path: "./config/.env" });
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());

// middelwares for Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

app.listen(PORT, () => {
  connect();
  console.log(`listening at port ${PORT}`);
});
