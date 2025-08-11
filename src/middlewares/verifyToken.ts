import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { prisma } from '../config/prisma.js';
import { UserRepositoryPrisma } from '../repositories/user/UserRepositoryPrisma.js';
import { AgencyRepository } from '../repositories/agency/AgencyRepository.js';
interface DecodedToken extends jwt.JwtPayload {
  userId: number;
  username: string;
  role: string;
  agencyId?: number | null;
}
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
      userId?: number;
      agencyId?:number;
    }
  }
}
const UserUpdates = new UserRepositoryPrisma(prisma);
const   AgencyQueries = new AgencyRepository(prisma);
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.token ||
    (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
     res.status(401).json({ error: 'unauthorized', message: 'No token provided' });
  return;
  }

  try {
    const decoded = jwt.verify(token, config.secret.jwtSecret as string) as DecodedToken;
    req.user = decoded;
    req.userId = decoded.userId;
    if (decoded.role === 'agency_owner') {
      const agency = await AgencyQueries.findByOwnerUserId(decoded.userId);
      if (agency) {
        req.agencyId = agency.id;
      }
    }

    await UserUpdates.updateFieldsById(req.userId, {last_active:new Date})
    next();
  } catch (error) {
     res.status(401).json({ error: 'unauthorized', message: 'Invalid or expired token' });
    return;
    }
};
