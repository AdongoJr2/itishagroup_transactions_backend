import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CustomSnakeNamingStrategy } from '../utils/strategies/custom-snake-naming.stategy';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    // logging: ['query', 'info', 'error', 'log'],
    entities: ['src/features/**/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    migrationsTableName: 'typeorm_migrations',
    namingStrategy: new CustomSnakeNamingStrategy(),
});

export default AppDataSource;