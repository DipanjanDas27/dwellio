import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";
import initializeDatabase from "./config/initdb.js";

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.get("/", (req, res) => {
            res.send("app is running successfully")
        });
        app.listen(process.env.PORT || 8001, () => {
            console.log(`Server is running on port ${process.env.PORT || 8001}`);
        });
        initializeDatabase();
    })
    .catch((err) => {
        console.error("Server failed to start:", err);
        process.exit(1);
    });
