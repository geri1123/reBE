import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/AuthServices/AuthService.js';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import { AgencyRepository } from '../../repositories/agency/AgencyRepository.js';
import { RegistrationRequestRepository } from '../../repositories/registrationRequest/RegistrationRequest.js';

// import { LoginRequest } from "../../types/auth.js";
// import { RegistrationData } from '../../types/auth.js';

// import { loginValidation } from '../../validators/users/loginValidation.js';
import { handleZodError } from '../../validators/zodErrorFormated.js';
import { registrationSchema } from '../../validators/users/authValidatorAsync.js';
import { prisma } from '../../config/prisma.js';
import { loginValidation, type LoginRequestData } from '../../validators/users/loginValidation.js';
import { RegistrationData } from '../../validators/users/authValidatorAsync.js';
// Initialize repositories
const userRepo = new UserRepositoryPrisma(prisma);
const agencyRepo = new AgencyRepository(prisma);
const requestRepo = new RegistrationRequestRepository(prisma);

const authService = new AuthService(userRepo, agencyRepo, requestRepo );

// Register
export async function register(
  req: Request<{}, {}, RegistrationData>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
      const validatedBody = await registrationSchema.parseAsync(req.body);
    const userId = await authService.registerUserByRole(validatedBody);
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
  req: Request<{}, {}, LoginRequestData>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body with Zod
    const validatedData = loginValidation.parse(req.body);

    // Pass validated data directly to the service
    const { user, token } = await authService.login(validatedData);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000, // 1 day
      path: '/',
    });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    handleZodError(err, next);
  }

// export async function loginUser(
//   req: Request<{}, {}, LoginRequest>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     const { identifier, password } = loginValidation.parse(req.body);
//     const { user, token } = await authService.login(identifier, password);

//     res.cookie('token', token, {
//       httpOnly: true,
//       // secure: process.env.NODE_ENV === 'production',
//       secure: false,
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       maxAge: 86400000,
//       path: '/',
//     });

//     res.status(200).json({
//       message: 'Login successful',
//       user: { id: user.id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     handleZodError(err, next);
//   }
}