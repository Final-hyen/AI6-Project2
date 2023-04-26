import { AppPaginatedResponse } from './../response.app';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppResponse } from '../response.app';

// Success Response를 생성하는 함수
export function buildSuccessResponse<T>(data: T): AppResponse<T> {
  return { data, errorMessage: null };
}

export function buildPaginatedResponse<T>(
  totalElements: number,
  page: number,
  limit: number,
  data: T[],
): AppPaginatedResponse<T> {
  const totalPages = Math.ceil(totalElements / limit);

  return { totalPages, totalElements, page, elements: data.length, data };
}

// Fail Response를 생성하는 함수
export function buildFailResponse(errorMessage: string): AppResponse<null> {
  return { data: null, errorMessage };
}

// 응답을 처리하는 미들웨어
export function responseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const responseData = res.locals.data;

  const responseBody = buildSuccessResponse(responseData);

  const logMessage = getSuccessLogMessage(req, res, responseBody);

  logger.info(logMessage);

  // responseData가 null 혹은 undefined 일 경우 204 코드로 반환
  responseData ? res.json(responseBody) : res.status(204).json(responseBody);
}

// Pagination 기반의 응답을 처리하는 미들웨어
export function paginatedResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { page, limit } = req.query;
  const { dataList, totalElements } = res.locals;

  const responseBody = buildPaginatedResponse(
    totalElements,
    Number(page),
    Number(limit),
    dataList,
  );

  const logMessage = getSuccessLogMessage(req, res, dataList);

  logger.info(logMessage);

  // responseBody의 data의 길이가 0인 경우 204 코드로 반환
  dataList.length === 0
    ? res.status(204).json(responseBody)
    : res.json(responseBody);
}

// 페이지네이션 결과를 res에 바인딩하는 함수
export function bindPaginatedResponse(
  res: Response,
  responseList: any[],
  totalElements: number,
) {
  res.locals.dataList = responseList;
  res.locals.totalElements = totalElements;
}

// 로깅 메시지를 반환하는 함수
function getSuccessLogMessage(
  req: Request,
  res: Response,
  responseBody: any,
): string {
  let statusCode: number;

  if (Array.isArray(responseBody)) {
    statusCode = responseBody.length !== 0 ? 200 : 204;
  } else {
    statusCode = responseBody ? 200 : 204;
  }
  return `[${req.method}] ${req.originalUrl} ${statusCode} ${
    req.ip
  } ${JSON.stringify(responseBody)}`;
}
