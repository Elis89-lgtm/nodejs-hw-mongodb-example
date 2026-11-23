import { Router } from 'express';
import { validateBody } from '../middlewares/validate-body-middleware.js';
import { registerUserValidationSchema } from '../validation/registerUserValidationSchema.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  requestResetPasswordEmailController,
} from '../controllers/auth.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js';
import { requestResetPasswordEmailValidationSchema } from '../validation/requestResetPasswordEmailValidationSchema.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(registerUserValidationSchema),
  registerUserController,
);

authRouter.post(
  '/login',
  validateBody(loginUserValidationSchema),
  loginUserController,
);

authRouter.post('/logout', logoutUserController);
authRouter.post('/refresh', refreshSessionController);

authRouter.post(
  '/request-reset-password-email',
  validateBody(requestResetPasswordEmailValidationSchema),
  requestResetPasswordEmailController,
);

export default authRouter;
