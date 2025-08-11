import { Request } from 'express';
export interface AppRequest extends Request {
  protocol: string;
  get(name: string): string | undefined;
}