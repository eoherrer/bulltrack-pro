import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, Bull, Favorite } from './entities';
import { DatabaseInitService } from './database-init.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const isProduction = configService.get('NODE_ENV') === 'production';

        // Log para debug
        console.log('DATABASE_URL exists:', !!databaseUrl);
        console.log('NODE_ENV:', configService.get('NODE_ENV'));

        // Si hay DATABASE_URL (Railway/Render), usarla directamente
        if (databaseUrl) {
          console.log('Using DATABASE_URL for connection');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Bull, Favorite],
            synchronize: false,
            logging: !isProduction,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          };
        }

        // Configuración local con variables individuales
        console.log('Using individual DB variables (local config)');
        console.log('DB_HOST:', configService.get('DB_HOST'));
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Bull, Favorite],
          synchronize: false,
          logging: !isProduction,
          ssl: false,
        };
      },
    }),
  ],
  providers: [DatabaseInitService],
  exports: [DatabaseInitService],
})
export class DatabaseModule {}
