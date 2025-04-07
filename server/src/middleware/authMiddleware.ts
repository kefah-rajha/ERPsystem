import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, AccessTokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload; 
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }

    // (اختياري ولكن جيد للأمان) تحقق إذا كان المستخدم لا يزال موجوداً في قاعدة البيانات
    // const userExists = await User.findById(decoded.userId).lean(); // lean() أسرع إذا كنت لا تحتاج لوظائف Mongoose
    // if (!userExists) {
    //   return res.status(401).json({ message: 'Unauthorized: User not found' });
    // }

    req.user = decoded;
    next(); 

  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ message: 'Unauthorized: Authentication failed' });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};