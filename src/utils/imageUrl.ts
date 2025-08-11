import { AppRequest } from "../types/express/app-request";

export function getFullImageUrl(relativePath: string, req: AppRequest): string {
  return `${req.protocol}://${req.get('host')}/${relativePath}`;
}