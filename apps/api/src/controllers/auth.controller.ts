import { Request, Response } from 'express';
import { HTTP_STATUS } from '@copilot/shared';
import { signupUser, loginUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { SignupInput, LoginInput } from '../schemas/auth.schema.js';


export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const input = req.body as SignupInput;

  const user = await signupUser(input);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Account created successfully. Please check your email to verify your account.',
    data: { user },
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const input = req.body as LoginInput;

  const { accessToken, user } = await loginUser(input, res);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken,
      user,
    },
  });
});
