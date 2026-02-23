import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("PostgreSQL Connected Successfully");
        console.log(`Database: ${client.database}, User: ${client.user}, Host: ${client.host}`);
        client.release();
    } catch (error) {
        console.error("PostgreSQL Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

pool.on("connect", () => {
    console.log("New DB connection established");
});

pool.on("error", (err) => {
    console.error("Unexpected DB Error:", err.message);
    process.exit(1);
});

export { pool, connectDB };