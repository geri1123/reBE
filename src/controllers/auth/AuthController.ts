import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/AuthServices/AuthService.js';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import { AgencyRepository } from '../../repositories/agency/AgencyRepository.js';
import { RegistrationRequestRepository } from '../../repositories/registrationRequest/RegistrationRequest.js';

import { handleZodError } from '../../validators/zodErrorFormated.js';
import { registrationSchema } from '../../validators/users/authValidatorAsync.js';
import { prisma } from '../../config/prisma.js';
import { loginValidation, type LoginRequestData } from '../../validators/users/loginValidation.js';
import { RegistrationData } from '../../validators/users/authValidatorAsync.js';
import { SupportedLang } from '../../locales/index.js';
const userRepo = new UserRepositoryPrisma(prisma);
import { t } from '../../utils/i18n.js';
const agencyRepo = new AgencyRepository(prisma);
const requestRepo = new RegistrationRequestRepository(prisma);

const authService = new AuthService(userRepo, agencyRepo, requestRepo );

// Register
export async function register(
  req: Request<{}, {}, RegistrationData>,
  res: Response,
  next: NextFunction
): Promise<void> {
    const language: SupportedLang = res.locals.lang;
    //  const language = req.language || "al" as SupportedLang;
  try {
      const validatedBody = await registrationSchema(language).parseAsync(req.body);
    const userId = await authService.registerUserByRole(validatedBody ,language);
    res.status(201).json({
      //  message: t("registrationSuccess", language),
      message: t("registrationSuccess" , language),
      userId,
    });
  } catch (err) {
  handleZodError(err, next, language);
  }
}

// Login
export async function loginUser(
  req: Request<{}, {}, LoginRequestData>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const language: SupportedLang = res.locals.lang;
  try {
    const validatedData = loginValidation(language).parse(req.body);
   const { user, token } = await authService.login(validatedData, language, validatedData.rememberMe);

    // Decide cookie duration
    const maxAge = validatedData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; 

    res.cookie('token', token, {
      httpOnly: true,
      // secure: false,
       secure: true, 
      // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      sameSite:"none",
      maxAge,
      path: '/',
    });

    res.status(200).json({
      message: t("loginSuccess", language),
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    handleZodError(err, next, res.locals.lang);
  }
}