-- Create the database
-- Run this as postgres superuser: psql -U postgres -f 01-create-database.sql

CREATE DATABASE bulltrack;

-- Connect to the database
\c bulltrack

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
