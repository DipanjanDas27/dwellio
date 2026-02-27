import { pool } from "../config/db.js";

export const createPropertiesTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('house','pg')),

      title VARCHAR(150) NOT NULL,
      description TEXT,

      bhk INT CHECK (bhk > 0),
      furnishing VARCHAR(20) CHECK (furnishing IN ('unfurnished','semi','fully')),

      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      pincode VARCHAR(10),

      rent_amount NUMERIC(10,2) NOT NULL CHECK (rent_amount > 0),
      security_deposit NUMERIC(10,2) CHECK (security_deposit >= 0),

      total_rooms INT CHECK (total_rooms >= 0),
      available_rooms INT CHECK (available_rooms >= 0),

      image_url TEXT NOT NULL, 

      is_available BOOLEAN DEFAULT TRUE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
    CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
    CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(rent_amount);
    CREATE INDEX IF NOT EXISTS idx_property_rooms ON properties(available_rooms);
  `;

  await pool.query(query);
};

export const createProperty = async (data) => {
  const query = `
    INSERT INTO properties (
      owner_id, property_type, title, description,
      bhk, furnishing,
      address, city, state, pincode,
      rent_amount, security_deposit,
      total_rooms, available_rooms,
      image_url, is_available
    )
    VALUES (
      $1,$2,$3,$4,
      $5,$6,
      $7,$8,$9,$10,
      $11,$12,
      $13,$14,
      $15,$16
    )
    RETURNING *;
  `;

  const values = [
    data.owner_id,
    data.property_type,
    data.title,
    data.description,
    data.bhk,
    data.furnishing,
    data.address,
    data.city,
    data.state,
    data.pincode,
    data.rent_amount,
    data.security_deposit,
    data.total_rooms,
    data.available_rooms,
    data.image_url,
    data.is_available ?? true,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getPropertiesByFilter = async ({
  minPrice,
  maxPrice,
  city,
}) => {
  const query = `
    SELECT *
    FROM properties
    WHERE rent_amount BETWEEN $1 AND $2
      AND LOWER(city) = LOWER($3)
      AND is_available = TRUE
    ORDER BY rent_amount ASC;
  `;

  const { rows } = await pool.query(query, [
    minPrice,
    maxPrice,
    city,
  ]);

  return rows;
};

export const getPropertyById = async (id, db = pool, forUpdate = false) => {
  const query = `
    SELECT *
    FROM properties
    WHERE id = $1
    ${forUpdate ? "FOR UPDATE" : ""}
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const updateProperty = async (id, data) => {
  const query = `
    UPDATE properties
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      bhk = COALESCE($3, bhk),
      furnishing = COALESCE($4, furnishing),
      address = COALESCE($5, address),
      city = COALESCE($6, city),
      state = COALESCE($7, state),
      pincode = COALESCE($8, pincode),
      rent_amount = COALESCE($9, rent_amount),
      security_deposit = COALESCE($10, security_deposit),
      total_rooms = COALESCE($11, total_rooms),
      available_rooms = COALESCE($12, available_rooms),
      is_available = COALESCE($13, is_available),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $14
    RETURNING *;
  `;

  const values = [
    data.title,
    data.description,
    data.bhk,
    data.furnishing,
    data.address,
    data.city,
    data.state,
    data.pincode,
    data.rent_amount,
    data.security_deposit,
    data.total_rooms,
    data.available_rooms,
    data.is_available,
    id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updatePropertyAvailability = async (
  propertyId,
  availableRooms,
  isAvailable,
  db = pool
) => {
  const { rows } = await db.query(
    `
    UPDATE properties
    SET available_rooms = $1,
        is_available = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *;
    `,
    [availableRooms, isAvailable, propertyId]
  );

  return rows[0];
};
export const updatePropertyImage = async (id, image_url) => {
  const query = `
    UPDATE properties
    SET image_url = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, image_url, updated_at;
  `;

  const { rows } = await pool.query(query, [image_url, id]);
  return rows[0];
};

export const deleteProperty = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM properties WHERE id = $1 RETURNING id;`,
    [id]
  );
  return rows[0];
};

export const getPropertiesByOwner = async (ownerId) => {
  const query = `
    SELECT *
    FROM properties
    WHERE owner_id = $1
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(query, [ownerId]);
  return rows;
};