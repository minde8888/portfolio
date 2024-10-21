import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { IDecodedToken } from '../../infrastructure/interfaces/IDecodedToken'; // Adjust if needed
import { IContainerResult } from '../../infrastructure/interfaces/IContainerResult';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const { authController }: IContainerResult = await container();
  const token = extractTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await authController.verifyToken(token);

    // Cast `req` as your augmented Request type to avoid TypeScript errors
    (req as Request & { user?: IDecodedToken }).user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Helper function to extract token from the Authorization header
const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};
