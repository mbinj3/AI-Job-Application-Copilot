import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';


export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenType: 'refresh';
}

export type DecodedAccessToken = AccessTokenPayload & JwtPayload;
export type DecodedRefreshToken = RefreshTokenPayload & JwtPayload;


export function generateAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = { expiresIn: '15m' };
  return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, env.jwtRefreshSecret, options);
}

export function verifyAccessToken(token: string): DecodedAccessToken {
  return jwt.verify(token, env.jwtAccessSecret) as DecodedAccessToken;
}

export function verifyRefreshToken(token: string): DecodedRefreshToken {
  return jwt.verify(token, env.jwtRefreshSecret) as DecodedRefreshToken;
}

export const REFRESH_COOKIE_NAME = 'refreshToken';

export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: (env.isProduction ? 'strict' : 'lax') as 'strict' | 'lax',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
