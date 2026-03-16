import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import { errorHandler } from "./middlewares/error.middleware.js"
import { globalLimiter } from "./middlewares/rateLimiter.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import propertyRoutes from "./routes/property.route.js";
import rentalRoutes from "./routes/rental.route.js";
import paymentRoutes from "./routes/payment.route.js";

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(cookieparser())
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.set("trust proxy", 1);

app.use(globalLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use(errorHandler)

export default app;