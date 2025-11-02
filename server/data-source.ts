import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); 

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307', 10),  username: process.env.DB_USERNAME || 'user_proy3',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'db_crud',
  

  entities: ['dist/**/*.entity.js'], 
  migrations: ['dist/database/migrations/*.js'], 
});