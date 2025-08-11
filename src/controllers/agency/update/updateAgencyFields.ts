import { Request, Response, NextFunction } from "express";
import { updateAgencyInfoService } from "../../../services/AgencyService/UpdateAgencyInfo";
import { AgencyRepository } from "../../../repositories/agency/AgencyRepository";
import { ValidationError } from "../../../errors/BaseError";
import { updateAgencySchema } from "../../../validators/agency/updateAgencyFields";
import { handleZodError } from "../../../validators/zodErrorFormated";
import { prisma } from "../../../config/prisma";
const agencyrepo = new AgencyRepository(prisma);
const service = new updateAgencyInfoService(agencyrepo);

export const updateAgencyFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const agencyId = req.agencyId;
    if (!agencyId) {
      throw new ValidationError({ agencyId: "Agency ID is required" });
    }

    const parsedData = updateAgencySchema.parse(req.body);
    const { name, agency_email, phone, address, website } = parsedData;

    const messages: string[] = [];

    if (name) {
      await service.changeAgencyName(agencyId, name);
      messages.push("Agency name updated successfully.");
    }
    if (agency_email) {
      await service.changeAgencyEmail(agencyId, agency_email);
      messages.push("Agency email updated successfully.");
    }
    if (phone) {
      await service.changeAgencyPhone(agencyId, phone);
      messages.push("Agency phone number updated successfully.");
    }
    if (address) {
      await service.changeAgencyAddress(agencyId, address);
      messages.push("Agency address updated successfully.");
    }
    if (website) {
      await service.changeAgencyWebsite(agencyId, website);
      messages.push("Agency website updated successfully.");
    }

    res.status(200).json({
      message: messages.join(" "),
    });
  } catch (err) {
    return handleZodError(err, next);
  }
};
