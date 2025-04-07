import jwt from 'jsonwebtoken';
import { User } from "../Modal/schemaUser";


// --- Access Token ---
const JWT_SECRET = process.env.JWT_SECRET || 'your-access-secret-key-CHANGE-ME';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; 

// --- Refresh Token ---
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-CHANGE-ME'; 
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// --- Payload Interfaces ---
export interface AccessTokenPayload {
  userId: string;
  userName: string; 
  role: string;
}
export interface UserJwt {
    _id: string;
    userName: string; 
    role: string;
  }
  
export interface RefreshTokenPayload {
  userId: string;
  // tokenVersion?: number;
}

// --- Generate Tokens ---
export const generateAccessToken = (user: UserJwt): string => {
  const payload: AccessTokenPayload = {
    userId: user._id.toString(),
    userName: user.userName, // Consider if email is needed in access token
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateRefreshToken = (user: UserJwt): string => {
  const payload: RefreshTokenPayload = {
    userId: user._id.toString(),
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

// --- Verify Tokens ---
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    return null;
  }
};