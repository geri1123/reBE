// import { Request, Response, NextFunction } from "express";
// import { supportedLanguages, SupportedLanguage } from "../config/constants.js";

// export function setLanguage(req: Request, res: Response, next: NextFunction) {
//   const langParam = req.params?.lang;
//   console.log("Middleware langParam:", langParam); 

//   if (typeof langParam === "string" && supportedLanguages.includes(langParam as SupportedLanguage)) {
//     req.language = langParam as SupportedLanguage;
//   } else {
//     req.language = "al";
//   }

//   console.log("Middleware set req.language:", req.language);  

//   next();
// }