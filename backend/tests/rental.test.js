import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";
import { hashPassword } from "../src/utils/hash.js";

describe("Rental Creation Flow", () => {
  let tenant;
  let owner;
  let property;
  let cookies;

  beforeAll(async () => {
    const tenantPassword = await hashPassword("Password@123");
    const ownerPassword = await hashPassword("Password@123");

    const tenantRes = await pool.query(
      `INSERT INTO users (full_name,email,phone,password_hash,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      ["Tenant User", "tenant@test.com", "9000000001", tenantPassword, "tenant"]
    );
    tenant = tenantRes.rows[0];

    const ownerRes = await pool.query(
      `INSERT INTO users (full_name,email,phone,password_hash,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      ["Owner User", "owner@test.com", "9000000002", ownerPassword, "owner"]
    );
    owner = ownerRes.rows[0];

    const propertyRes = await pool.query(
      `INSERT INTO properties
       (owner_id,property_type,title,address,city,state,rent_amount,security_deposit,total_rooms,available_rooms,image_url)
       VALUES ($1,'house','Test House','Addr','City','State',10000,5000,1,1,$2)
       RETURNING *`,
      [owner.id, "https://dummyimage.com/600x400/000/fff.jpg"]
    );
    property = propertyRes.rows[0];

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: tenant.email, password: "Password@123" });

    cookies = loginRes.headers["set-cookie"];
  });

  afterAll(async () => {
    await pool.query("DELETE FROM rental_agreements");
    await pool.query("DELETE FROM payments");
    await pool.query("DELETE FROM properties");
    await pool.query("DELETE FROM users");
    await pool.end();
  });

  it("should activate rental when payment succeeds", async () => {
    const res = await request(app)
      .post(`/api/v1/rentals/${property.id}`)
      .set("Cookie", cookies)
      .send({
        start_date: "2026-04-01",
        end_date: "2026-10-01",
        notice_period: 1,
        monthly_rent: 10000,
        idempotency_key: "key-success-1",
        paymentMode: "auto"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.rental_status).toBe("active");

    const updatedProperty = await pool.query(
      "SELECT available_rooms FROM properties WHERE id=$1",
      [property.id]
    );

    expect(updatedProperty.rows[0].available_rooms).toBe(0);
  });

  it("should keep rental pending when payment fails", async () => {
    await pool.query(
      "UPDATE properties SET available_rooms=1 WHERE id=$1",
      [property.id]
    );

    const res = await request(app)
      .post(`/api/v1/rentals/${property.id}`)
      .set("Cookie", cookies)
      .send({
        start_date: "2026-05-01",
        end_date: "2026-11-01",
        notice_period: 1,
        monthly_rent: 10000,
        idempotency_key: "key-fail-1",
        paymentMode: "network_error"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.rental_status).toBe("pending");

    const updatedProperty = await pool.query(
      "SELECT available_rooms FROM properties WHERE id=$1",
      [property.id]
    );

    expect(updatedProperty.rows[0].available_rooms).toBe(1);
  });

  it("should prevent duplicate rental via idempotency", async () => {
    const res1 = await request(app)
      .post(`/api/v1/rentals/${property.id}`)
      .set("Cookie", cookies)
      .send({
        start_date: "2026-06-01",
        end_date: "2026-12-01",
        notice_period: 1,
        monthly_rent: 10000,
        idempotency_key: "key-duplicate-1",
        paymentMode: "auto"
      });

    const res2 = await request(app)
      .post(`/api/v1/rentals/${property.id}`)
      .set("Cookie", cookies)
      .send({
        start_date: "2026-06-01",
        end_date: "2026-12-01",
        notice_period: 1,
        monthly_rent: 10000,
        idempotency_key: "key-duplicate-1",
        paymentMode: "auto"
      });

    expect(res2.body.data.payment.idempotency_key).toBe("key-duplicate-1");
  });
});