import { ValidationError } from "../../errors/BaseError.js";
import { IAgencyRepository } from "../../repositories/agency/IAgencyRepository.js";

export class updateAgencyInfoService {
  constructor(private agencyRepo: IAgencyRepository) {}

  async changeAgencyName(agencyId: number, newName: string): Promise<void> {
    if (await this.agencyRepo.agencyNameExist(newName)) {
      throw new ValidationError({ agencyName: "Agency name already exists" });
    }
    await this.agencyRepo.updateAgencyFields(agencyId, { agency_name: newName });
  }

  async changeAgencyEmail(agencyId: number, newEmail: string): Promise<void> {
    await this.agencyRepo.updateAgencyFields(agencyId, { agency_email: newEmail });
  }

  async changeAgencyPhone(agencyId: number, newPhone: string): Promise<void> {
    await this.agencyRepo.updateAgencyFields(agencyId, { phone: newPhone });
  }
  async changeAgencyAddress(agencyId: number, newAddress: string): Promise<void> {
    await this.agencyRepo.updateAgencyFields(agencyId, { address: newAddress });
  }
  async changeAgencyWebsite(agencyId: number, newWebsite: string): Promise<void> {
    await this.agencyRepo.updateAgencyFields(agencyId, { website: newWebsite });
  }
}   