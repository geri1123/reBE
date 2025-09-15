import { Request, Response, NextFunction } from "express";
import { updateAgencyInfoService } from "../../../services/AgencyService/UpdateAgencyInfo.js";
import { AgencyRepository } from "../../../repositories/agency/AgencyRepository.js";
import { ValidationError } from "../../../errors/BaseError.js";
import { updateAgencySchema } from "../../../validators/agency/updateAgencyFields.js";
import { handleZodError } from "../../../validators/zodErrorFormated.js";
import { prisma } from "../../../config/prisma.js";
import { SupportedLang } from "../../../locales/index.js";
import { t } from "../../../utils/i18n.js";
const agencyrepo = new AgencyRepository(prisma);
const service = new updateAgencyInfoService(agencyrepo);

export const updateAgencyFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
   const language:SupportedLang=res.locals.lang;
  try {
     
    const agencyId = req.agencyId;
   if (!agencyId) {
  throw new ValidationError(
    { agencyId: t("invalidAgencyId", language) },
    language
  );
}

    const parsedData = updateAgencySchema.parse(req.body);
    const { name, agency_email, phone, address, website } = parsedData;

    const messages: string[] = [];

    if (name) {
      await service.changeAgencyName(agencyId, name , language);
      messages.push(t("agencyNameUpdated" , language));
    }
    if (agency_email) {
      await service.changeAgencyEmail(agencyId, agency_email);
      messages.push(t("agencyEmailUpdated" , language));
    }
    if (phone) {
      await service.changeAgencyPhone(agencyId, phone);
      messages.push(t("agencyPhoneUpdated" , language));
    }
    if (address) {
      await service.changeAgencyAddress(agencyId, address);
      messages.push(t("agencyAddressUpdated" , language));
    }
    if (website) {
      await service.changeAgencyWebsite(agencyId, website);
      messages.push(t("agencyWebsiteUpdated" , language));
    }

    res.status(200).json({
      message: messages.join(" "),
    });
  } catch (err) {
    return handleZodError(err, next , language);
  }
};
