import { pool } from "../config/db.js";

export const createRentalTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS rental_agreements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      start_date DATE NOT NULL,
      end_date DATE NOT NULL CHECK (end_date > start_date),
      notice_period INT CHECK (notice_period >= 0),

      monthly_rent NUMERIC(10,2) NOT NULL CHECK (monthly_rent > 0),
      security_paid BOOLEAN DEFAULT FALSE,

      agreement_document_url TEXT ,

      status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending','active','terminated','cancelled')),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_rental_tenant ON rental_agreements(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_rental_owner ON rental_agreements(owner_id);
    CREATE INDEX IF NOT EXISTS idx_rental_property ON rental_agreements(property_id);
    CREATE INDEX IF NOT EXISTS idx_rental_dates ON rental_agreements(property_id, start_date, end_date);
  `;

  await pool.query(query);
};

export const createRental = async (data, db = pool) => {
  const query = `
    INSERT INTO rental_agreements (
      property_id, tenant_id, owner_id,
      start_date, end_date, notice_period,
      monthly_rent, agreement_document_url,
      status, security_paid
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `

  const values = [
    data.property_id,
    data.tenant_id,
    data.owner_id,
    data.start_date,
    data.end_date,
    data.notice_period ? Number(data.notice_period) : null,
    data.monthly_rent,
    data.agreement_document_url ? agreement_document_url : "",
    data.status,
    data.security_paid,
  ]

  const { rows } = await db.query(query, values)
  return rows[0]
}

export const getRentalsByTenant = async (tenantId) => {
  const { rows } = await pool.query(
    `SELECT * FROM rental_agreements WHERE tenant_id = $1;`,
    [tenantId]
  );
  return rows;
};

export const getRentalsByOwner = async (ownerId) => {
  const { rows } = await pool.query(
    `SELECT * FROM rental_agreements WHERE owner_id = $1;`,
    [ownerId]
  );
  return rows;
};

export const getRentalById = async (rentalId) => {
  const query = `
    SELECT *
    FROM rental_agreements
    WHERE id = $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [rentalId]);
  return rows[0];
};

export const updateRentalStatus = async (id, status, db = pool) => {
  const { rows } = await db.query(
    `UPDATE rental_agreements
     SET status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *;`,
    [status, id]
  );
  return rows[0];
};

export const updateRentalAfterPayment = async (rentalId, db = pool) => {
  const { rows } = await db.query(
    `
    UPDATE rental_agreements
    SET status = 'active',
        security_paid = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
    `,
    [rentalId]
  );

  return rows[0];
};

export const renewRentalDatesAndStatus = async (
  rentalId,
  start_date,
  end_date,
  status,
  db = pool
) => {

  const query = `
    UPDATE rental_agreements
    SET
      start_date = $1,
      end_date = $2,
      status = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
  `;

  const { rows } = await db.query(query, [
    start_date,
    end_date,
    status,
    rentalId,
  ]);

  return rows[0];
};

export const deleteRental = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM rental_agreements WHERE id = $1 RETURNING id;`,
    [id]
  );
  return rows[0];
};