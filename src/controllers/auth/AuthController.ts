import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/AuthServices/AuthService.js';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import { AgencyRepository } from '../../repositories/agency/AgencyRepository.js';
import { RegistrationRequestRepository } from '../../repositories/registrationRequest/RegistrationRequest.js';

import { LoginRequest } from "../../types/auth.js";
import { RegistrationData } from '../../types/auth.js';

import { loginValidation } from '../../validators/users/loginValidation.js';
import { handleZodError } from '../../validators/zodErrorFormated.js';
import { registrationSchema, RegistrationInput } from '../../validators/users/authValidatorAsync.js';
import { prisma } from '../../config/prisma.js';
import { NotificationRepository } from '../../repositories/notification/notificationRepository.js';
import { NotificationService } from '../../services/Notifications/Notifications.js';
// Initialize repositories
const userRepo = new UserRepositoryPrisma(prisma);
const agencyRepo = new AgencyRepository(prisma);
const requestRepo = new RegistrationRequestRepository(prisma);
// const notificationRepo = new NotificationRepository(prisma); 
// const notificationService = new NotificationService(notificationRepo);
const authService = new AuthService(userRepo, agencyRepo, requestRepo );

// Register
export async function register(
  req: Request<{}, {}, RegistrationData>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await registrationSchema.parseAsync(req.body);
    const userId = await authService.registerUserByRole(req.body);
    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userId,
    });
  } catch (err) {
    handleZodError(err, next);
  }
}

// Login
export async function loginUser(
  req: Request<{}, {}, LoginRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { identifier, password } = loginValidation.parse(req.body);
    const { user, token } = await authService.login(identifier, password);

    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
      path: '/',
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    handleZodError(err, next);
  }
}