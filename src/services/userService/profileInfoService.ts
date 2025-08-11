import type { IUserRepository } from '../../repositories/user/IUserRepository.js';
import { BaseUserService } from './BaseUserService.js';
export class ProfileInfoService extends BaseUserService{
  constructor(userRepo: IUserRepository) {
    super(userRepo);
  }


  async updateAboutMe(userId: number, aboutMe: string): Promise<void> {
    await this.userRepo.updateFieldsById(userId, { about_me: aboutMe });
  }

  async updateUserPhone(userId: number, phone: string): Promise<void> {
    await this.userRepo.updateFieldsById(userId, { phone });
  }

  async updateFirstNlastN(userId: number, first_name: string): Promise<void> {
    await this.userRepo.updateFieldsById(userId, { first_name });
  }
  async updateLName(userId:number , last_name: string): Promise<void> {
    await this.userRepo.updateFieldsById(userId, { last_name });
  }
}
