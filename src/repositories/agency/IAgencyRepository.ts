import { AgencyModel, NewAgency, NewAgencyUnchecked } from '../../types/database.js';
import { AgencyInfo } from '../../types/userinfo.js';
export interface IAgencyRepository {

  licenseExists(license: string): Promise<boolean>;
  findAgencyByUserId(userId: number): Promise<AgencyInfo | null>;
  findByOwnerUserId(ownerUserId: number): Promise<{ id: number } | null>;
  findByPublicCode(publicCode: string): Promise<AgencyModel | null>;
  findLogoById(agencyId: number): Promise<{ logo: string | null } | null>;
  findWithOwnerById(agencyId: number): Promise<{ id: number; agency_name: string; owner_user_id: number } | null>;
  agencyNameExist(agencyName: string): Promise<boolean>;
  create(agencyData: Omit<NewAgencyUnchecked, 'id' | 'public_code' | 'status'>): Promise<number>;
  activateAgency(agencyId: number): Promise<void>;
  updateAgencyFields(
    agencyId: number,
    fields: Partial<Omit<NewAgency, 'id' | 'created_at' | 'public_code' | 'updated_at'>>
  ): Promise<void>;
}