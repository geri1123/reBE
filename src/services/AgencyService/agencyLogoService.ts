import path from 'path';
import fs from 'fs/promises';
import type { IAgencyRepository } from '../../repositories/agency/IAgencyRepository.js';
import { FileSystemError, NotFoundError } from '../../errors/BaseError.js';
import { SupportedLang,t } from "../../locales/index.js";

import {bucket} from "../../config/firebase.js"
import { uploadFileToFirebase } from '../../utils/firebaseUpload/firebaseUploader.js';
export class AgencyLogoService {
  constructor(private agencyRepo: IAgencyRepository) {}
async updateAgencyLogo(
  agencyId: number,
  language:SupportedLang,
  file: Express.Multer.File,
 
): Promise<string> {
  const agency = await this.agencyRepo.findLogoById(agencyId);
  if (!agency) throw new NotFoundError(t('agencyNotFound' ,language));

 const logoPath=agency.logo;

 if(logoPath){
  try{
    await bucket.file(logoPath).delete();

  }catch(err:any){
    console.warn("Faild to delete old image")
  }
 }
  // Remove old logo
 const newLogoPath=await uploadFileToFirebase(file  , 'agency_logo')
  await this.agencyRepo.updateAgencyFields(agencyId, { logo: newLogoPath });

  return newLogoPath;
}
 
}
