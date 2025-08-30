import { Request , Response  , NextFunction } from "express";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/index.js";
export async function RecoverPassword(req: Request, res: Response, next: NextFunction) {
 const language: SupportedLang = res.locals.lang;
 try{
 const {email}=req.body;
 }catch(error){
    next(error);
 }
}