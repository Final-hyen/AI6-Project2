import { Letter } from './../letter/domain/letter.entity';
import 'dotenv/config';
import { createConnection, DataSourceOptions, getConnection } from 'typeorm';
import { logger } from '../misc/logger';
import { User } from '../user/domain/user.entity';
import mongoose from 'mongoose';
import * as Redis from 'redis';
import { promisify } from 'util';

// Redis
export const redisClient = Redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on('ready', () => {
  logger.info('Redis가 연결되었습니다.');
});

redisClient.on('error', (error) => {
  logger.error(`Redis 연결 실패: ${error}`);
});

// Redis를 즉시 실행 함수를 통해 연결
(async () => {
  await redisClient.connect();
})();

// PostgreSQL
export async function connectPostgresql(): Promise<void> {
  try {
    const connectionOptions: DataSourceOptions = {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, Letter],
      synchronize: true,
      logging: true,
      logger: 'advanced-console',
    };

    await createConnection(connectionOptions);

    logger.info('PostgreSQL 데이터베이스에 연결 완료하였습니다.');
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
(async () => {
  await connectPostgresql();
})();

// MongoDB
export async function connectMongoDB(): Promise<void> {
  try {
    const MongoDB_URL = process.env.MongoDB_URL;

    mongoose.set('strictQuery', true);

    mongoose.connect(MongoDB_URL || 'env 파일 확인');
    const db = mongoose.connection;

    db.on('connected', () => logger.info('mongoDB에 연결을 완료하였습니다.'));
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
