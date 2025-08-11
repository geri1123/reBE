import type { IUserRepository } from "../../repositories/user/IUserRepository.js";

export class BaseUserService {
  constructor(protected userRepo: IUserRepository) {}
}