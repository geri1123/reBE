import path from 'path';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../errors/BaseError.js';
import { getFullImageUrl } from '../../../utils/imageUrl.js';
import { AgencyRepository } from '../../../repositories/agency/AgencyRepository.js';
import { AgencyLogoService } from '../../../services/AgencyService/agencyLogoService.js';
import { prisma } from '../../../config/prisma.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const agencyRepo = new AgencyRepository(prisma);
const agencyLogoService = new AgencyLogoService(agencyRepo);

export async function updateAgencyLogo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.userId) throw new UnauthorizedError('User not authenticated');
  if (!req.agencyId) throw new UnauthorizedError('Agency not found');
 if (!req.file) {
    
    res.status(400).json({ success: false, message: 'No logo file uploaded' });
    return;
  }
  try {
    const baseDir = path.resolve(__dirname, '..', '..', '..');
    const newPath = await agencyLogoService.updateAgencyLogo(req.agencyId, req.file, baseDir);
    const fullUrl = getFullImageUrl(newPath, req);

    res.json({ success: true, logoUrl: fullUrl, message: 'Agency logo updated successfully' });
  } catch (error) {
    next(error);
  }
}