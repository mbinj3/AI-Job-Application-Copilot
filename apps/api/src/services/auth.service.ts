import { prisma } from '../db/index.js';
import { logger } from '../config/logger.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, REFRESH_COOKIE_NAME, getRefreshCookieOptions } from '../utils/token.js';
import { AppError } from '../utils/errors.js';
import { HTTP_STATUS } from '@copilot/shared';
import type { SignupInput, LoginInput } from '../schemas/auth.schema.js';
import type { Response } from 'express';
import type { Prisma } from '@prisma/client';


export interface SafeUser {
  id: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;
}

export interface SafeAuthUser {
  id: string;
  email: string;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
}

export async function signupUser(input: SignupInput): Promise<SafeUser> {
  const { email, password } = input;

  logger.info({ email }, 'auth.signup: signup attempt');

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    logger.warn({ email }, 'auth.signup: email already registered');
    throw new AppError('An account with this email address already exists.', {
      statusCode: 409,
      code: 'EMAIL_ALREADY_EXISTS',
    });
  }

  const passwordHash = await hashPassword(password);

  let user: SafeUser;

  try {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  } catch (err) {
    const prismaError = err as Prisma.PrismaClientKnownRequestError;
    if (prismaError.code === 'P2002') {
      logger.warn({ email }, 'auth.signup: unique constraint violation (race condition)');
      throw new AppError('An account with this email address already exists.', {
        statusCode: 409,
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }
    throw err;
  }

  logger.info({ userId: user.id, email: user.email }, 'auth.signup: user created successfully');

  return user;
}

export async function loginUser(
  input: LoginInput,
  res: Response
): Promise<{ accessToken: string; user: SafeAuthUser }> {
  const { email, password } = input;

  logger.info({ email }, 'auth.login: login attempt');

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      isEmailVerified: true,
      lastLoginAt: true,
    },
  });

  const INVALID_CREDENTIALS_ERROR = new AppError('Invalid email or password', {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    code: 'INVALID_CREDENTIALS',
  });

  if (!user) {
    await verifyPassword(password, '$2b$12$dummyhashfortimingnormalization.placeholder');
    logger.warn({ email }, 'auth.login: user not found');
    throw INVALID_CREDENTIALS_ERROR;
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    logger.warn({ userId: user.id }, 'auth.login: invalid password');
    throw INVALID_CREDENTIALS_ERROR;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      lastLoginAt: true,
    },
  });

  const accessToken = generateAccessToken({ sub: updatedUser.id, email: updatedUser.email });
  const refreshToken = generateRefreshToken({ sub: updatedUser.id, tokenType: 'refresh' });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

  logger.info({ userId: updatedUser.id }, 'auth.login: login successful');

  return {
    accessToken,
    user: updatedUser,
  };
}