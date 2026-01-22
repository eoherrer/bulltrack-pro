-- Create tables for Bulltrack
-- Run this after creating the database: psql -U postgres -d bulltrack -f 02-create-tables.sql

-- Enum types
CREATE TYPE bull_uso AS ENUM ('vaquillona', 'vaca');
CREATE TYPE bull_origen AS ENUM ('propio', 'catalogo');
CREATE TYPE bull_pelaje AS ENUM ('negro', 'colorado');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bulls table
CREATE TABLE bulls (
    id SERIAL PRIMARY KEY,
    caravana VARCHAR(50) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    uso bull_uso NOT NULL,
    origen bull_origen NOT NULL,
    pelaje bull_pelaje NOT NULL,
    raza VARCHAR(100) NOT NULL,
    edad_meses INTEGER NOT NULL,
    caracteristica_destacada VARCHAR(255),
    crecimiento INTEGER NOT NULL CHECK (crecimiento >= 0 AND crecimiento <= 100),
    facilidad_parto INTEGER NOT NULL CHECK (facilidad_parto >= 0 AND facilidad_parto <= 100),
    reproduccion INTEGER NOT NULL CHECK (reproduccion >= 0 AND reproduccion <= 100),
    moderacion INTEGER NOT NULL CHECK (moderacion >= 0 AND moderacion <= 100),
    carcasa INTEGER NOT NULL CHECK (carcasa >= 0 AND carcasa <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table (user-bull relationship)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bull_id INTEGER NOT NULL REFERENCES bulls(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, bull_id)
);

-- Indexes for performance
CREATE INDEX idx_bulls_caravana ON bulls(caravana);
CREATE INDEX idx_bulls_nombre ON bulls USING gin(nombre gin_trgm_ops);
CREATE INDEX idx_bulls_origen ON bulls(origen);
CREATE INDEX idx_bulls_uso ON bulls(uso);
CREATE INDEX idx_bulls_pelaje ON bulls(pelaje);
CREATE INDEX idx_bulls_filters ON bulls(origen, uso, pelaje);

-- Index for calculated score (for sorting)
CREATE INDEX idx_bulls_score ON bulls((
    crecimiento * 0.30 +
    facilidad_parto * 0.25 +
    reproduccion * 0.20 +
    moderacion * 0.15 +
    carcasa * 0.10
) DESC);

-- Indexes for favorites
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_bull_id ON favorites(bull_id);
CREATE INDEX idx_favorites_user_bull ON favorites(user_id, bull_id);
