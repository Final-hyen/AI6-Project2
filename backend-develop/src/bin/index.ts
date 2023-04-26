import { HttpServer } from '../app/app';
import { HttpApp } from '../app/app.ifs';
import { logger } from '../misc/logger';

async function main() {
  const httpServer: HttpApp = await HttpServer.of();

  // 정의되지 않은 exception을 필터링해야함
  process.on('uncaughtException', (error) => {
    logger.error(`uncaughtException: ${error}`);
  });

  for (const signal of ['SIGTERM', 'SIGHUP', 'SIGINT', 'SIGUSR2']) {
    process.on(signal, async () => {
      if (!httpServer.isShuttingDown) {
        logger.info(
          `시스템 시그널, ${signal}을 수신하였습니다. 의도된 서버 중지 신호입니다. Graceful shutdown을 시작합니다.`,
        );
        await httpServer.stop();
        logger.info('Graceful shutdown이 완료되었습니다.');
        process.exit(0);
      }
    });
  }

  // 전체 애플리케이션 시작
  httpServer.start();
}

main();
