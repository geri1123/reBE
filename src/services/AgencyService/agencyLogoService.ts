import path from 'path';
import fs from 'fs/promises';
import type { IAgencyRepository } from '../../repositories/agency/IAgencyRepository.js';
import { FileSystemError, NotFoundError } from '../../errors/BaseError.js';

export class AgencyLogoService {
  constructor(private agencyRepo: IAgencyRepository) {}
async updateAgencyLogo(
  agencyId: number,
  file: Express.Multer.File,
  _baseDir: string 
): Promise<string> {
  const agency = await this.agencyRepo.findLogoById(agencyId);
  if (!agency) throw new NotFoundError('Agency not found');

  const projectRoot = path.resolve();
  const newLogoPath = `uploads/images/agency_logo/${file.filename}`;

  // Remove old logo if it exists
  if (agency.logo && agency.logo.trim() !== '') {
    const oldLogoPath = path.join(projectRoot, agency.logo);
    try {
      await fs.unlink(oldLogoPath);
      console.log(`Old logo deleted: ${oldLogoPath}`);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.error('Failed to delete logo:', err);
        throw new FileSystemError('Failed to delete old agency logo');
      } else {
        console.warn('Old logo not found:', oldLogoPath);
      }
    }
  }

  await this.agencyRepo.updateAgencyFields(agencyId, { logo: newLogoPath });

  return newLogoPath;
}
  // async updateAgencyLogo(
  //   agencyId: number,
  //   file: Express.Multer.File,
  //   baseDir: string
  // ): Promise<string> {
  //   const agency = await this.agencyRepo.findLogoById(agencyId);
  //   if (!agency) throw new NotFoundError('Agency not found');

  //   // Remove old logo if it exists
  //   if (agency.logo && agency.logo.trim() !== '') {
  //     const oldLogoPath = path.resolve(baseDir, agency.logo);
  //     try {
  //       await fs.unlink(oldLogoPath);
  //       console.log(`Old logo deleted: ${oldLogoPath}`);
  //     } catch (err: any) {
  //       if (err.code !== 'ENOENT') {
  //         throw new FileSystemError('Failed to delete old agency logo');
  //       }
  //     }
  //   }

  //   const newLogoPath = `uploads/images/agency_logo/${file.filename}`;
  //   await this.agencyRepo.updateAgencyFields(agencyId, { logo: newLogoPath });

  //   return newLogoPath;
  // }
}
