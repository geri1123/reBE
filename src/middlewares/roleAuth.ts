// middleware/roleAuth.ts
import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError, ForbiddenError } from '../errors/BaseError.js';
import { t } from '../utils/i18n.js';
import { SupportedLang } from '../locales/index.js';
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
   const language: SupportedLang = res.locals.lang
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!allowedRoles.includes(req.user.role)) {
     throw new ForbiddenError(t("insufficientPermissions", language));
    }

    next();
  };
};

// Convenience functions
export const requireUser = requireRole(['user']);
export const requireAgent = requireRole(['agent']);
export const requireAgencyOwner = requireRole(['agency_owner']);
export const requireAgentOrOwner = requireRole(['agent', 'agency_owner']);