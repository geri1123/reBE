// controllers/city/cityController.ts
import { Request, Response, NextFunction } from "express";
import { CityRepository } from "../../repositories/city/CityRepository.js";
import { prisma } from "../../config/prisma.js";

const cityRepo = new CityRepository(prisma);

// GET /countries
export async function getCountries(req: Request, res: Response, next: NextFunction) {
  try {
    const countries = await cityRepo.getAllCountries();
    res.status(200).json({ success: true, countries });
  } catch (err) {
    next(err);
  }
}

// GET /cities/:countryCode
export async function getCities(req: Request, res: Response, next: NextFunction) {
  try {
    const { countryCode } = req.params;
    const cities = await cityRepo.getCitiesByCountry(countryCode);
    res.status(200).json({ success: true, cities });
  } catch (err) {
    next(err);
  }
}
