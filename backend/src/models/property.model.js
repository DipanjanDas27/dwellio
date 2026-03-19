import { pool } from "../config/db.js";

export const createPropertiesTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      title VARCHAR(150) NOT NULL,
      description TEXT,

      bhk INT NOT NULL CHECK (bhk > 0),
      furnishing VARCHAR(20) CHECK (furnishing IN ('unfurnished','semi','fully')),

      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      pincode VARCHAR(10),

      rent_amount NUMERIC(10,2) NOT NULL CHECK (rent_amount > 0),
      security_deposit NUMERIC(10,2) CHECK (security_deposit >= 0),
      notice_period_days INT NOT NULL CHECK (notice_period_days >= 0),

      total_rooms INT NOT NULL CHECK (total_rooms >= 0),
      available_rooms INT NOT NULL CHECK (available_rooms >= 0),

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
      owner_id, title, description,
      bhk, furnishing,
      address, city, state, pincode,
      rent_amount, security_deposit, notice_period_days,
      total_rooms, available_rooms,
      image_url, is_available,
      is_shared, max_tenants, current_tenants
    )
    VALUES (
      $1,$2,$3,$4,
      $5,$6,
      $7,$8,$9,$10,
      $11,$12,$13,
      $14,$15,
      $16,$17,
      $18,$19
    )
    RETURNING *;
  `

  const values = [
    data.owner_id,
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
    data.notice_period_days,
    data.total_rooms,
    data.available_rooms,
    data.image_url,
    data.is_available ?? true,
    data.is_shared ?? false,
    data.max_tenants ?? 1,
    data.current_tenants ?? 0,
  ]

  const { rows } = await pool.query(query, values)
  return rows[0]
}

export const getPropertiesByFilter = async ({
  minPrice,
  maxPrice,
  search
}) => {

  let query = `
    SELECT *
    FROM properties
    WHERE 1=1
  `

  const values = []
  let index = 1

  if (minPrice) {
    query += ` AND rent_amount >= $${index++}`
    values.push(minPrice)
  }

  if (maxPrice) {
    query += ` AND rent_amount <= $${index++}`
    values.push(maxPrice)
  }

  if (search) {
    query += `
      AND (
        city ILIKE $${index}
        OR address ILIKE $${index}
        OR title ILIKE $${index}
      )
    `
    values.push(`%${search}%`)
    index++
  }

  const { rows } = await pool.query(query, values)

  return rows
}

export const getPropertyById = async (propertyId, client = pool, forUpdate = false) => {
  const query = `
    SELECT
      p.*,
      u.full_name  AS owner_name,
      u.email      AS owner_email,
      u.phone      AS owner_phone,
      u.profile_image_url AS owner_avatar
    FROM properties p
    JOIN users u ON u.id = p.owner_id
    WHERE p.id = $1
    ${forUpdate ? "FOR UPDATE" : ""}
    LIMIT 1;
  `
  const { rows } = await client.query(query, [propertyId])
  return rows[0]
}

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
      notice_period_days = COALESCE($14, notice_period_days),
      
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
    data.notice_period_days,
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