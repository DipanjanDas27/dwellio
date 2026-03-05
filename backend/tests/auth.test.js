import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";

describe("Auth Module", () => {
  const testUser = {
    full_name: "Auth Test User",
    email: "authtest1@example.com",
    phone: "9876543390",
    password: "Password@123",
    role: "owner",
  };

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    await pool.end();
  });

  describe("Register", () => {
    it("should register a new user and set cookies", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);

      const cookies = res.headers["set-cookie"].join(";");
      expect(cookies).toContain("accessToken");
      expect(cookies).toContain("refreshToken");
    });
  });

  describe("Login", () => {
    it("should login user and set cookies", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const cookies = res.headers["set-cookie"].join(";");
      expect(cookies).toContain("accessToken");
      expect(cookies).toContain("refreshToken");
    });
  });

  describe("Refresh Token", () => {
    it("should refresh access token using cookie", async () => {
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const cookies = loginRes.headers["set-cookie"];

      const refreshCookie = cookies.find((c) =>
        c.startsWith("refreshToken")
      );

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", refreshCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const newCookies = res.headers["set-cookie"].join(";");
      expect(newCookies).toContain("accessToken");
    });
  });

  describe("Logout", () => {
    it("should logout authenticated user", async () => {
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const cookies = loginRes.headers["set-cookie"];

      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", cookies);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});