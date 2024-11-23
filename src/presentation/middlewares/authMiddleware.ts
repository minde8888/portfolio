import { Request, Response, NextFunction } from 'express';

import { container } from '../../infrastructure/di/container';
import { IDecodedToken } from '../../infrastructure/interfaces/IDecodedToken';
import { IContainerResult } from '../../infrastructure/interfaces/IContainerResult';
import { IAuthenticatedRequest } from '../../infrastructure/interfaces/IAuthenticatedRequest';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authController }: IContainerResult = await container();
    const token = extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken: IDecodedToken = await authController.verifyToken(token);
    (req as IAuthenticatedRequest).user = decodedToken;

    console.log("decodedToken", decodedToken);
    

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = extractBearerToken(authHeader) || extractJwtToken(authHeader);
  return token || null;
};

const extractBearerToken = (authHeader: string): string | null => {
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  return tokenMatch ? tokenMatch[1] : null;
};

const extractJwtToken = (authHeader: string): string | null => {
  const jwtMatch = authHeader.match(/([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/);
  return jwtMatch ? jwtMatch[0] : null;
};
