// middleware/roleAuth.ts
import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError, ForbiddenError } from '../errors/BaseError.js';

import { SupportedLang,t } from '../locales/index.js';
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
   const language: SupportedLang = res.locals.lang
    if (!req.user) {
      throw new UnauthorizedError(t("userNotAuthenticated", language));
    }

    if (!allowedRoles.includes(req.user.role)) {
     throw new ForbiddenError(t("insufficientPermissions", language));
    }

    next();
  };
};


export const requireUser = requireRole(['user']);
export const requireAgent = requireRole(['agent']);
export const requireAgencyOwner = requireRole(['agency_owner']);
export const requireAgentOrOwner = requireRole(['agent', 'agency_owner']);