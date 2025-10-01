import { SupportedLanguage } from '../config/constants'; // adjust path
import { DecodedToken } from '../middleware/authMiddleware'; // adjust path to where you define it

declare global {
  namespace Express {
    interface Request {
      language?: SupportedLanguage;
      user?: DecodedToken;
      userId?: number;
      agencyId?: number;
    }
  }
}
// import { SupportedLanguage } from './config/constants'; // adjust path as needed

// declare global {
//   namespace Express {
//     interface Request {
//       language?: SupportedLanguage;
//     }
//   }
// }


