import { IDecodedToken } from '../infrastructure/interfaces/IDecodedToken';

declare global {
  namespace Express {
    interface Request {
      user?: IDecodedToken;
    }
  }
}

export {};