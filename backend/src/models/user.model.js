import { pool } from "../config/db.js";

export const createUsersTable = async () => {
  const query = `
     CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      phone VARCHAR(15) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,

      role VARCHAR(20) NOT NULL CHECK (role IN ('tenant','owner','admin')),

      profile_image_url TEXT,
      refresh_token_hash TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `;

  await pool.query(query);
};

export const createUser = async ({
  full_name,
  email,
  phone,
  password_hash,
  role,
  profile_image_url = null,
}) => {
  const query = `
    INSERT INTO users (
      full_name,
      email,
      phone,
      password_hash,
      role,
      profile_image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, full_name, email, role, profile_image_url, created_at;
  `;

  const values = [
    full_name,
    email,
    phone,
    password_hash,
    role,
    profile_image_url,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1 LIMIT 1;`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const getUserById = async (id, db = pool) => {
  const query = `
    SELECT id, full_name, email, role, profile_image_url, created_at, updated_at
    FROM users
    WHERE id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const updateRefreshToken = async (userId, refresh_token_hash) => {
  const query = `
    UPDATE users
    SET refresh_token_hash = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2;
  `;
  await pool.query(query, [refresh_token_hash, userId]);
};

export const updateProfileImage = async (userId, profile_image_url) => {
  const query = `
    UPDATE users
    SET profile_image_url = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, profile_image_url, updated_at;
  `;
  const { rows } = await pool.query(query, [
    profile_image_url,
    userId,
  ]);
  return rows[0];
};

export const updateUser = async (
  userId,
  { full_name, email, phone }
) => {
  const query = `
    UPDATE users
    SET
      full_name = COALESCE($1, full_name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING id, full_name, email, role, updated_at;
  `;

  const values = [full_name, email, phone, userId];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateUserPassword = async (userId, password_hash) => {
  const query = `
    UPDATE users
    SET password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, email, updated_at;
  `;

  const { rows } = await pool.query(query, [password_hash, userId]);
  return rows[0];
};

export const deleteUser = async (userId) => {
  const query = `
    DELETE FROM users
    WHERE id = $1
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};