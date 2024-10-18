import { Request, Response, NextFunction } from 'express';
import { IDecodedToken } from '../../infrastructure/interfaces/IDecodedToken';

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & { user?: IDecodedToken }).user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
 
    if (user.role && roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};