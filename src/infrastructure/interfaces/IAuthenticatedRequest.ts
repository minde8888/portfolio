import { Request } from "express";
import { IDecodedToken } from "./IDecodedToken";


export interface IAuthenticatedRequest extends Request {
    user?: IDecodedToken;
}