// import "express";

// declare module "express" {
//   export interface Request {
//     language?: SupportedLanguage;
//   }
// }
import { SupportedLanguage } from './config/constants'; // adjust path as needed

declare global {
  namespace Express {
    interface Request {
      language?: SupportedLanguage;
    }
  }
}


