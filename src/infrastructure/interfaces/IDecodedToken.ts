import { JwtPayload } from "jsonwebtoken";


export interface IDecodedToken extends JwtPayload {
    userId?: string;
    email?: string;
    role?: string;
  }