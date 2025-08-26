import { en } from "./en.js";
import {it} from "./it.js"
import { al } from "./al.js";

export const translations = { en, it, al } as const;

export type SupportedLang = keyof typeof translations;