// backend/src/repositories/AgencyRepository.ts
// import { prisma } from '../../config/prisma.js';
import { generatePublicCode } from '../../utils/hash.js';
import { AgencyModel, NewAgency, NewAgencyUnchecked } from '../../types/database.js';
import { PrismaClient } from '@prisma/client';
export class AgencyRepository {
  constructor(private prisma : PrismaClient) {}
  async licenseExists(license: string): Promise<boolean> {
    const agency = await this.prisma.agency.findFirst({
      where: { license_number: license },
      select: { id: true },
    });
    return agency !== null;
  }
async findLogoById(agencyId: number): Promise<{ logo: string | null } | null> {
  return this.prisma.agency.findUnique({
    where: { id: agencyId },
    select: { logo: true },
  });
}
async findWithOwnerById(agencyId: number): Promise<{ id: number; agency_name: string; owner_user_id: number } | null> {
  return this.prisma.agency.findUnique({
    where: { id: agencyId },
    select: {
      id: true,
      agency_name: true,
      owner_user_id: true,
    },
  });
}
  async findByOwnerUserId(ownerUserId: number): Promise<{ id: number } | null> {
    const agency = await this.prisma.agency.findFirst({
      where: { owner_user_id: ownerUserId },
      select: { id: true },
    });
    return agency || null;
  }
  
  async findByPublicCode(publicCode: string): Promise<AgencyModel | null> {
    return this.prisma.agency.findUnique({
      where: { public_code: publicCode },
    });
  }

  async agencyNameExist(agencyName: string): Promise<boolean> {
    const agency = await this.prisma.agency.findFirst({
      where: { agency_name: agencyName },
      select: { id: true },
    });
    return agency !== null;
  }

  async create(
    agencyData: Omit<NewAgencyUnchecked, 'id' | 'public_code' | 'status'>
  ): Promise<number> {
    let publicCode: string;
    do {
      publicCode = generatePublicCode();
    } while (await this.publicCodeExists(publicCode));

    const newAgency = await this.prisma.agency.create({
      data: {
        ...agencyData,
        public_code: publicCode,
        status: 'inactive',
        agency_email: agencyData.agency_email ?? null,
      },
      select: { id: true },
    });

    return newAgency.id;
  }

  private async publicCodeExists(publicCode: string): Promise<boolean> {
    const existing = await this.prisma.agency.findUnique({
      where: { public_code: publicCode },
      select: { id: true },
    });
    return existing !== null;
  }

  async activateAgency(agencyId: number): Promise<void> {
    await this.prisma.agency.update({
      where: { id: agencyId },
      data: { status: 'active' },
    });
  }

  async updateAgencyFields(
    agencyId: number,
    fields: Partial<Omit<NewAgency, 'id' | 'created_at' | 'public_code' | 'updated_at'>>
  ): Promise<void> {
    const allowedFields = [
      'agency_name',
      'logo',
      'license_number',
      'agency_email',
      'phone',
      'address',
      'website',
      'status',
    ] as const;

    const filteredData = Object.fromEntries(
      Object.entries(fields).filter(
        ([key, val]) => val !== undefined && allowedFields.includes(key as typeof allowedFields[number])
      )
    ) as Partial<NewAgency>;

    if (Object.keys(filteredData).length === 0) return;

    await this.prisma.agency.update({
      where: { id: agencyId },
      data: { ...filteredData },
    });
  }
}
