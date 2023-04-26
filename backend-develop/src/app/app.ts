import { getConnection } from 'typeorm';
import { redisClient } from './../loader/connection';
import * as http from 'http';
import 'reflect-metadata';
import '../loader/connection';
import './container/container';
import { ExpressApp } from './app.express';
import { HttpApp } from './app.ifs';
import config from '../config';
import { logger } from '../misc/logger';

export class HttpServer {
  private constructor() {}

  static async of(): Promise<HttpApp> {
    const expressApp = await ExpressApp.of();
    const server = http.createServer(expressApp);

    return {
      start() {
        server.listen(config.port);
        server.on('listening', () => {
          logger.info(`서버가 포트 ${config.port}에서 운영중입니다.`);
        });
      },
      stop() {
        logger.info(`서버 중지 작업을 시작합니다.`);

        // @ts-ignore for describe that this backend server is shutting down. That might not occurs any errors.
        this.isShuttingDown = true;

        return new Promise<void>((resolve, reject) => {
          server.close(async (error) => {
            if (error !== undefined) {
              logger.error(
                `- HTTP 서버 중지를 실패해버렸습니다: ${error.message}`,
              );
              reject(error);
            }

            logger.info('- 들어오는 커넥션을 더 이상 받지 않겠습니다.');

            // PostgreSQL과 연결 종료
            const pgConnection = await getConnection();
            pgConnection.destroy();

            // redis 데이터베이스와 연결 종료
            redisClient.quit();

            logger.info('- DB 커넥션을 정상적으로 끊었습니다');
            logger.info('서버 중지 작업을 성공적으로 마쳤습니다.');

            // @ts-ignore for describe that this backend server is shutting down. That might not occurs any errors.
            this.isShuttingDown = false;

            resolve();
          });
        });
      },
      isShuttingDown: false,
      _app: expressApp,
    };
  }
}
