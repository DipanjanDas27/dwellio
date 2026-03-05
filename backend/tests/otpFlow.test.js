import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";
import { hashPassword } from "../src/utils/hash.js";
import { redisClient } from "../src/config/redis.js";

describe("Password Flows", () => {

    let user;
    let cookies;

    beforeAll(async () => {

        const passwordHash = await hashPassword("Password@123");

        const userRes = await pool.query(
            `INSERT INTO users (full_name,email,phone,password_hash,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
            ["Password User", "password@test.com", "9000000010", passwordHash, "tenant"]
        );

        user = userRes.rows[0];

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: user.email,
                password: "Password@123"
            });

        console.log(loginRes.body);

        cookies = loginRes.headers["set-cookie"];

    });

    afterAll(async () => {

        await pool.query("DELETE FROM users WHERE email='password@test.com'");
        await pool.end();
        await redisClient.quit();

    });

    it("should change password when logged in", async () => {

        const res = await request(app)
            .patch("/api/v1/auth/me/change-password")
            .set("Cookie", cookies)
            .send({
                oldPassword: "Password@123",
                newPassword: "NewPassword@123"
            });

        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should send forgot password OTP", async () => {

        const res = await request(app)
            .post("/api/v1/auth/forgot-password")
            .send({
                email: user.email
            });

        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should verify forgot password OTP", async () => {

        const forgotRes = await request(app)
            .post("/api/v1/auth/forgot-password")
            .send({ email: user.email });

        console.log(forgotRes.body);

        const cookies = forgotRes.headers["set-cookie"];

        const otp = await redisClient.get(`otp:${user.email}`);

        const verifyRes = await request(app)
            .post("/api/v1/auth/verify-forgot-otp")
            .set("Cookie", cookies)
            .send({ otp });

        console.log(verifyRes.body);

        expect(verifyRes.statusCode).toBe(200);
        expect(verifyRes.body.success).toBe(true);

    });
    it("should reset password and login with new password", async () => {

        const forgotRes = await request(app)
            .post("/api/v1/auth/forgot-password")
            .send({
                email: user.email
            });

        console.log(forgotRes.body);

        const cookies = forgotRes.headers["set-cookie"];

        const resetRes = await request(app)
            .post("/api/v1/auth/reset-password")
            .set("Cookie", cookies)
            .send({
                email: user.email,
                newPassword: "FinalPassword@123"
            });

        console.log(resetRes.body);

        expect(resetRes.statusCode).toBe(200);

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: user.email,
                password: "FinalPassword@123"
            });

        console.log(loginRes.body);

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.success).toBe(true);

    });
});