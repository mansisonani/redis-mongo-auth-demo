import express from "express";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT
connectDB();

app.use(express.json());
app.use(rateLimiter);

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
