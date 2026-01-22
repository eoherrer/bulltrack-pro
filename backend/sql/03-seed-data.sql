-- Seed data for Bulltrack
-- Run this after creating tables: psql -U postgres -d bulltrack -f 03-seed-data.sql

-- Insert default user (password: seed28)
-- Password hash generated with bcrypt (10 rounds)
INSERT INTO users (email, password_hash, name) VALUES
('admin@seed28.com', '$2b$10$q9MV76PJI5fGo7fq6EoTuOFAPelJe1WOnSUqwn55e4fg7pVFle/7u', 'Admin Seed28');

-- Insert bulls data
INSERT INTO bulls (caravana, nombre, uso, origen, pelaje, raza, edad_meses, caracteristica_destacada, crecimiento, facilidad_parto, reproduccion, moderacion, carcasa) VALUES
('992', 'Toro Black Emerald', 'vaquillona', 'propio', 'negro', 'Angus', 36, 'Top 1% calving ease', 85, 98, 75, 60, 82),
('845', 'Red Diamond', 'vaca', 'catalogo', 'colorado', 'Angus', 42, 'Top 5% carcass', 90, 40, 88, 70, 95),
('102', 'General 102', 'vaquillona', 'catalogo', 'negro', 'Brangus', 30, NULL, 70, 92, 65, 80, 60),
('554', 'Indomable', 'vaca', 'propio', 'colorado', 'Hereford', 48, NULL, 60, 30, 95, 50, 75),
('210', 'Midnight Express', 'vaquillona', 'propio', 'negro', 'Angus', 28, 'Efficiency Leader', 78, 95, 82, 85, 68),
('773', 'Rustic King', 'vaca', 'catalogo', 'colorado', 'Braford', 54, 'Heat Tolerant', 92, 35, 90, 45, 88),
('304', 'Shadow Warrior', 'vaquillona', 'propio', 'negro', 'Brangus', 32, 'Performance Pro', 88, 85, 70, 65, 91);

-- Add more bulls for pagination testing (optional - uncomment if needed)
/*
INSERT INTO bulls (caravana, nombre, uso, origen, pelaje, raza, edad_meses, caracteristica_destacada, crecimiento, facilidad_parto, reproduccion, moderacion, carcasa) VALUES
('411', 'Thunder Strike', 'vaca', 'propio', 'negro', 'Angus', 40, 'High Growth', 95, 55, 78, 62, 80),
('522', 'Golden Star', 'vaquillona', 'catalogo', 'colorado', 'Hereford', 34, NULL, 72, 88, 70, 75, 65),
('633', 'Iron Bull', 'vaca', 'propio', 'negro', 'Brangus', 46, 'Muscular Build', 82, 60, 85, 58, 92),
('744', 'Silver Moon', 'vaquillona', 'catalogo', 'colorado', 'Braford', 29, 'Docile', 68, 90, 72, 88, 55),
('855', 'Dark Knight', 'vaca', 'propio', 'negro', 'Angus', 52, 'Top Genetics', 88, 45, 92, 48, 85),
('966', 'Red Baron', 'vaquillona', 'catalogo', 'colorado', 'Hereford', 31, NULL, 75, 85, 68, 78, 70),
('077', 'Black Storm', 'vaca', 'propio', 'negro', 'Brangus', 44, 'Weather Resistant', 80, 50, 88, 55, 78),
('188', 'Copper King', 'vaquillona', 'catalogo', 'colorado', 'Braford', 36, 'Calving Ease', 65, 95, 75, 82, 58),
('299', 'Night Rider', 'vaca', 'propio', 'negro', 'Angus', 50, NULL, 92, 42, 90, 52, 88),
('310', 'Sunset Blaze', 'vaquillona', 'catalogo', 'colorado', 'Hereford', 33, 'Fertility Plus', 70, 82, 95, 72, 62);
*/
