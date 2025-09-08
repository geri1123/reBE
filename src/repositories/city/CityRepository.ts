// repositories/city/CityRepository.ts
import { PrismaClient } from "@prisma/client";

export class CityRepository {
  constructor(private prisma: PrismaClient) {}

  // get all countries
  async getAllCountries() {
    return this.prisma.country.findMany({
      orderBy: { name: "asc" },
    });
  }

  // get cities by country code (e.g. "AL")
  async getCitiesByCountry(countryCode: string) {
    return this.prisma.city.findMany({
      where: {
        country: {
          code: {
            equals: countryCode,
          
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }
}
