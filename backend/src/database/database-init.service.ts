import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Check if tables exist
      const tablesExist = await this.checkTablesExist();

      if (!tablesExist) {
        this.logger.log('Tables not found. Initializing database...');
        await this.createTables();
        await this.seedData();
        this.logger.log('Database initialized successfully!');
      } else {
        this.logger.log('Database tables already exist. Skipping initialization.');

        // Check if seed data exists
        const hasData = await this.checkDataExists();
        if (!hasData) {
          this.logger.log('No data found. Seeding database...');
          await this.seedData();
          this.logger.log('Database seeded successfully!');
        }
      }
    } catch (error) {
      this.logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async checkTablesExist(): Promise<boolean> {
    try {
      const result = await this.dataSource.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'users'
        );
      `);
      return result[0].exists;
    } catch {
      return false;
    }
  }

  private async checkDataExists(): Promise<boolean> {
    try {
      const result = await this.dataSource.query(`SELECT COUNT(*) FROM users;`);
      return parseInt(result[0].count) > 0;
    } catch {
      return false;
    }
  }

  private async createTables() {
    // Create extensions
    await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm";`);

    // Create enum types
    await this.dataSource.query(`
      DO $$ BEGIN
        CREATE TYPE bull_uso AS ENUM ('vaquillona', 'vaca');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await this.dataSource.query(`
      DO $$ BEGIN
        CREATE TYPE bull_origen AS ENUM ('propio', 'catalogo');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await this.dataSource.query(`
      DO $$ BEGIN
        CREATE TYPE bull_pelaje AS ENUM ('negro', 'colorado');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bulls table
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS bulls (
        id SERIAL PRIMARY KEY,
        caravana VARCHAR(50) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        uso bull_uso NOT NULL,
        origen bull_origen NOT NULL,
        pelaje bull_pelaje NOT NULL,
        raza VARCHAR(100) NOT NULL,
        edad_meses INTEGER NOT NULL,
        caracteristica_destacada VARCHAR(255),
        crecimiento INTEGER NOT NULL,
        facilidad_parto INTEGER NOT NULL,
        reproduccion INTEGER NOT NULL,
        moderacion INTEGER NOT NULL,
        carcasa INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create favorites table
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        bull_id INTEGER NOT NULL REFERENCES bulls(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, bull_id)
      );
    `);

    // Create indexes
    await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_bulls_caravana ON bulls(caravana);`);
    await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_bulls_origen ON bulls(origen);`);
    await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_bulls_uso ON bulls(uso);`);
    await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_bulls_pelaje ON bulls(pelaje);`);
    await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_bulls_filters ON bulls(origen, uso, pelaje);`);
    await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);`);
    await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_favorites_bull_id ON favorites(bull_id);`);
  }

  private async seedData() {
    // Create default user (password: seed28)
    const passwordHash = await bcrypt.hash('seed28', 10);

    await this.dataSource.query(`
      INSERT INTO users (email, password_hash, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING;
    `, ['admin@seed28.com', passwordHash, 'Admin Seed28']);

    // Insert bulls data
    const bulls = [
      { caravana: '992', nombre: 'Toro Black Emerald', uso: 'vaquillona', origen: 'propio', pelaje: 'negro', raza: 'Angus', edad_meses: 36, caracteristica_destacada: 'Top 1% calving ease', crecimiento: 85, facilidad_parto: 98, reproduccion: 75, moderacion: 60, carcasa: 82 },
      { caravana: '845', nombre: 'Red Diamond', uso: 'vaca', origen: 'catalogo', pelaje: 'colorado', raza: 'Angus', edad_meses: 42, caracteristica_destacada: 'Top 5% carcass', crecimiento: 90, facilidad_parto: 40, reproduccion: 88, moderacion: 70, carcasa: 95 },
      { caravana: '102', nombre: 'General 102', uso: 'vaquillona', origen: 'catalogo', pelaje: 'negro', raza: 'Brangus', edad_meses: 30, caracteristica_destacada: null, crecimiento: 70, facilidad_parto: 92, reproduccion: 65, moderacion: 80, carcasa: 60 },
      { caravana: '554', nombre: 'Indomable', uso: 'vaca', origen: 'propio', pelaje: 'colorado', raza: 'Hereford', edad_meses: 48, caracteristica_destacada: null, crecimiento: 60, facilidad_parto: 30, reproduccion: 95, moderacion: 50, carcasa: 75 },
      { caravana: '210', nombre: 'Midnight Express', uso: 'vaquillona', origen: 'propio', pelaje: 'negro', raza: 'Angus', edad_meses: 28, caracteristica_destacada: 'Efficiency Leader', crecimiento: 78, facilidad_parto: 95, reproduccion: 82, moderacion: 85, carcasa: 68 },
      { caravana: '773', nombre: 'Rustic King', uso: 'vaca', origen: 'catalogo', pelaje: 'colorado', raza: 'Braford', edad_meses: 54, caracteristica_destacada: 'Heat Tolerant', crecimiento: 92, facilidad_parto: 35, reproduccion: 90, moderacion: 45, carcasa: 88 },
      { caravana: '304', nombre: 'Shadow Warrior', uso: 'vaquillona', origen: 'propio', pelaje: 'negro', raza: 'Brangus', edad_meses: 32, caracteristica_destacada: 'Performance Pro', crecimiento: 88, facilidad_parto: 85, reproduccion: 70, moderacion: 65, carcasa: 91 },
    ];

    for (const bull of bulls) {
      await this.dataSource.query(`
        INSERT INTO bulls (caravana, nombre, uso, origen, pelaje, raza, edad_meses, caracteristica_destacada, crecimiento, facilidad_parto, reproduccion, moderacion, carcasa)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT DO NOTHING;
      `, [
        bull.caravana, bull.nombre, bull.uso, bull.origen, bull.pelaje,
        bull.raza, bull.edad_meses, bull.caracteristica_destacada,
        bull.crecimiento, bull.facilidad_parto, bull.reproduccion,
        bull.moderacion, bull.carcasa
      ]);
    }
  }
}
