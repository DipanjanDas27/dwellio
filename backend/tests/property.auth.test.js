import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";
import { hashPassword } from "../src/utils/hash.js";

describe("Property Authorization", () => {

    let owner;
    let tenant;

    let ownerCookies;
    let tenantCookies;

    beforeAll(async () => {

        const ownerPass = await hashPassword("Password@123");
        const tenantPass = await hashPassword("Password@123");

        const ownerRes = await pool.query(
            `INSERT INTO users (full_name,email,phone,password_hash,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
            ["Owner Auth", "owner-auth@test.com", "9000000101", ownerPass, "owner"]
        );

        owner = ownerRes.rows[0];

        const tenantRes = await pool.query(
            `INSERT INTO users (full_name,email,phone,password_hash,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
            ["Tenant Auth", "tenant-auth@test.com", "9000000102", tenantPass, "tenant"]
        );

        tenant = tenantRes.rows[0];

        const ownerLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: owner.email,
                password: "Password@123"
            });

        console.log(ownerLogin.body);

        ownerCookies = ownerLogin.headers["set-cookie"];

        const tenantLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: tenant.email,
                password: "Password@123"
            });

        console.log(tenantLogin.body);

        tenantCookies = tenantLogin.headers["set-cookie"];

    });

    afterAll(async () => {

        await pool.query("DELETE FROM properties");
        await pool.query("DELETE FROM users WHERE email IN ($1,$2)", [
            "owner-auth@test.com",
            "tenant-auth@test.com"
        ]);

        await pool.end();

    });

    it("should block unauthenticated user from creating property", async () => {

        const res = await request(app)
            .post("/api/v1/properties")
            .send({ title: "Unauthorized Property" });

        console.log(res.body);

        expect(res.statusCode).toBe(401);

    });

    it("should block tenant from creating property", async () => {

        const res = await request(app)
            .post("/api/v1/properties")
            .set("Cookie", tenantCookies)
            .send({ title: "Tenant Property" });

        console.log(res.body);

        expect(res.statusCode).toBe(403);

    });

    it("should allow owner to create property", async () => {

        const res = await request(app)
            .post("/api/v1/properties")
            .set("Cookie", ownerCookies)
            .field("property_type", "apartment")
            .field("title", "Auth Test Property")
            .field("description", "Test property")
            .field("bhk", 2)
            .field("furnishing", "semi")
            .field("address", "Test Address")
            .field("city", "Test City")
            .field("state", "Test State")
            .field("pincode", "734001")
            .field("rent_amount", 10000)
            .field("security_deposit", 5000)
            .field("total_rooms", 2)
            .field("available_rooms", 2)
            .attach("image", "public/temp/test.jpg");

        console.log(res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

    });

});