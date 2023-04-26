import { Role } from '../domain/enum/role.vo';

export type JwtLoginPayload = {
  sub: number;

  role: Role;
};

export function generateAccessTokenPayload(
  sub: number,
  role: Role,
): JwtLoginPayload {
  return { sub, role };
}

export function generateRefreshTokenPayload(
  sub: number,
  role: Role,
): JwtLoginPayload {
  return { sub, role };
}
