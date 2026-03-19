CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL CHECK (role IN ('tenant','owner','admin')),

    profile_image_url TEXT,

    refresh_token TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

      image_url TEXT,

      is_available BOOLEAN DEFAULT TRUE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

ALTER TABLE properties ADD COLUMN is_shared BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN max_tenants INT DEFAULT 1;
ALTER TABLE properties ADD COLUMN current_tenants INT DEFAULT 0;


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

    agreement_document_url TEXT,

    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending','active','terminated','cancelled')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE rental_agreements
  ADD CONSTRAINT no_overlapping_rentals
  EXCLUDE USING gist (
    property_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  )
  WHERE (status = 'active');

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
ALTER TABLE payments ADD COLUMN payment_type VARCHAR(20) DEFAULT 'security' CHECK (payment_type IN ('security', 'monthly'));
ALTER TABLE payments ADD COLUMN due_date DATE;
ALTER TABLE payments ADD COLUMN month_year VARCHAR(7);
