import { Router } from 'express';
import { responseMiddleware } from '../../misc/utils/response.util';
import { researchController } from '../presentation/research.controller';
const researchRouter: Router = Router();

// 리서치 데이터1-1인 가구 데이터(서울)
// 삽입
researchRouter.post(
  '/1',
  researchController.insertResearch1,
  responseMiddleware,
);
// 불러오기
researchRouter.get(
  '/1',
  researchController.getAllResearch1,
  responseMiddleware,
);

//리서치 데이터2-참여하지 않는 이유(서울)
// 삽입
researchRouter.post(
  '/2',
  researchController.insertResearch2,
  responseMiddleware,
);
// 불러오기
researchRouter.get(
  '/2',
  researchController.getAllResearch2,
  responseMiddleware,
);

//리서치 데이터3-체육활동 참가 이유(서울)
// 삽입
researchRouter.post(
  '/3',
  researchController.insertResearch3,
  responseMiddleware,
);
// 불러오기
researchRouter.get(
  '/3',
  researchController.getAllResearch3,
  responseMiddleware,
);

export default researchRouter;
