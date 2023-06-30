import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Ipfs } from '../src/ipfs/entities/ipfs.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: ['dist/**/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};
export default new DataSource(dataSourceOptions);
