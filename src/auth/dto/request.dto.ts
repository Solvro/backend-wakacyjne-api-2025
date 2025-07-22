import type { Request } from "express";

import type { AuthDto } from "./auth.dto";

export interface CustomRequest extends Request {
  user?: AuthDto;
}
