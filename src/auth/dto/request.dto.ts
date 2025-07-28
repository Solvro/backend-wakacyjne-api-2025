import type { Request } from "express";

export interface CustomRequest extends Request {
  user: { email: string };
}
