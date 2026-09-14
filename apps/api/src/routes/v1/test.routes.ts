import { Router } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../utils/errors.js';

const router = Router();

// Test controlled AppError
router.get('/app-error', () => {
  throw new BadRequestError('Testing controlled application error', {
    reason: 'Sample operational error details',
  });
});

// Test not found error
router.get('/not-found-error', () => {
  throw new NotFoundError('Test resource could not be found');
});

// Test unauthorized error
router.get('/unauthorized-error', () => {
  throw new UnauthorizedError('Test authorization required');
});

// Test unexpected server error (unhandled Error)
router.get('/uncaught-error', () => {
  throw new Error('Testing unhandled internal server error');
});

export const testRoutes = router;

