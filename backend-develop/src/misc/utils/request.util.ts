import { NextFunction, Request, Response } from "express";

// 수정된 entity를 반환해주는 함수
export function toUpdateEntity<T>(entity: T, updateRequest: Partial<T>): T {
  const reducedEntity = Object.entries(updateRequest).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        (acc as any)[key] = value;
      }

      return acc;
    },
    entity,
  );

  return reducedEntity;
}

// 주어진 파라미터들을 모두 Number 타입으로 변환해주는 함수
export function transformToNumber(...args: any[]): number[] {
  return args?.map(value => Number(value));
}
