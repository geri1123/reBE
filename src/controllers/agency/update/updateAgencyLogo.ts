import path from 'path';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../errors/BaseError.js';
import { getFullImageUrl } from '../../../utils/imageUrl.js';
import { AgencyRepository } from '../../../repositories/agency/AgencyRepository.js';
import { AgencyLogoService } from '../../../services/AgencyService/agencyLogoService.js';
import { prisma } from '../../../config/prisma.js';
import { SupportedLang } from '../../../locales/index.js';
import { t } from '../../../utils/i18n.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const agencyRepo = new AgencyRepository(prisma);
const agencyLogoService = new AgencyLogoService(agencyRepo);

export async function updateAgencyLogo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
   const language:SupportedLang=res.locals.lang;
  if (!req.userId) throw new UnauthorizedError(t("userNotAuthenticated" , language));
  if (!req.agencyId) throw new UnauthorizedError(t("userNotFound" , language));
 if (!req.file) {
    
    res.status(400).json({ success: false, message:t("nofileUpload" , language) });
    return;
  }
  try {
    const baseDir = path.resolve(__dirname, '..', '..', '..');
    const newPath = await agencyLogoService.updateAgencyLogo(req.agencyId,language, req.file, baseDir);
    const fullUrl = getFullImageUrl(newPath, req);

    res.json({ success: true, logoUrl: fullUrl, message:t("agencyLogoUpdated" , language) });
  } catch (error) {
    next(error);
  }
}