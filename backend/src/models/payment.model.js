import { pool } from "../config/db.js";

export const createPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      agreement_id UUID NOT NULL REFERENCES rental_agreements(id) ON DELETE CASCADE,

      tenant_id UUID NOT NULL REFERENCES users(id),
      owner_id UUID NOT NULL REFERENCES users(id),

      amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

      payment_status VARCHAR(20) DEFAULT 'pending'
        CHECK (payment_status IN ('pending','success','failed','refunded')),

      transaction_id VARCHAR(150) UNIQUE,
      idempotency_key VARCHAR(150) UNIQUE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_payment_tenant ON payments(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_payment_owner ON payments(owner_id);
    CREATE INDEX IF NOT EXISTS idx_payment_agreement ON payments(agreement_id);
  `;

  await pool.query(query);
};

export const createPayment = async (data, db = pool) => {
  const query = `
    INSERT INTO payments (
      agreement_id, tenant_id, owner_id,
      amount, payment_status,
      payment_type, due_date, month_year,
      transaction_id, idempotency_key
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `

  const values = [
    data.agreement_id,
    data.tenant_id,
    data.owner_id,
    data.amount,
    data.payment_status ?? "pending",
    data.payment_type ?? "security",
    data.due_date ?? null,
    data.month_year ?? null,
    data.transaction_id ?? null,
    data.idempotency_key,
  ]

  const { rows } = await db.query(query, values)
  return rows[0]
}

export const getPaymentsByTenant = async (tenantId) => {
  const { rows } = await pool.query(
    `SELECT * FROM payments WHERE tenant_id = $1;`,
    [tenantId]
  );
  return rows;
};

export const getPaymentsByOwner = async (ownerId) => {
  const { rows } = await pool.query(
    `SELECT * FROM payments WHERE owner_id = $1;`,
    [ownerId]
  );
  return rows;
};

export const getPaymentById = async (paymentId) => {
  const query = `
    SELECT *
    FROM payments
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [paymentId]);
  return rows[0];
};


export const getPaymentsByAgreementId = async (agreementId) => {
  const query = `
    SELECT * FROM payments
    WHERE agreement_id = $1
    ORDER BY created_at DESC
  `
  const { rows } = await pool.query(query, [agreementId])
  return rows
}

export const getPaymentByTransactionId = async (transactionId) => {
  const query = `
    SELECT *
    FROM payments
    WHERE transaction_id = $1;
  `;

  const { rows } = await pool.query(query, [transactionId]);
  return rows[0];
};

export const getPaymentByIdempotencyKey = async (
  idempotency_key,
  db = pool
) => {
  const { rows } = await db.query(
    `SELECT * FROM payments WHERE idempotency_key = $1 LIMIT 1`,
    [idempotency_key]
  );
  return rows[0];
};

export const updatePaymentStatus = async (id, status, transaction_id, db = pool) => {
  const { rows } = await db.query(
    `UPDATE payments
     SET payment_status = $1,
         transaction_id = COALESCE($2, transaction_id),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *;`,
    [status, transaction_id, id]
  );
  return rows[0];
};

export const deletePayment = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM payments WHERE id = $1 RETURNING id;`,
    [id]
  );
  return rows[0];
};

export const createMonthlyPayment = async (data ,db =pool) => {
  const query = `
    INSERT INTO payments (
      agreement_id, tenant_id, owner_id,
      amount, payment_status, payment_type,
      due_date, month_year, idempotency_key
    )
    VALUES ($1,$2,$3,$4,'pending','monthly',$5,$6,$7)
    ON CONFLICT (idempotency_key) DO NOTHING
    RETURNING *;
  `
  const { rows } = await db.query(query, [
    data.agreement_id,
    data.tenant_id,
    data.owner_id,
    data.amount,
    data.due_date,
    data.month_year,
    data.idempotency_key,
  ])
  return rows[0]
}

export const getUnpaidMonthlyPayments = async (daysOverdue) => {
  const query = `
    SELECT p.*, 
           u.email AS tenant_email,
           u.full_name AS tenant_name
    FROM payments p
    JOIN users u ON u.id = p.tenant_id
    WHERE p.payment_type = 'monthly'
      AND p.payment_status = 'pending'
      AND p.due_date <= CURRENT_DATE - INTERVAL '${daysOverdue} days'
  `
  const { rows } = await pool.query(query)
  return rows
}

export const getActiveRentalsForCron = async () => {
  const query = `
    SELECT r.*,
           u.email AS tenant_email,
           u.full_name AS tenant_name
    FROM rental_agreements r
    JOIN users u ON u.id = r.tenant_id
    WHERE r.status = 'active'
  `
  const { rows } = await pool.query(query)
  return rows
}
