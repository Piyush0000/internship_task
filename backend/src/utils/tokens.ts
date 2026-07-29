import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const createAccessToken = (userId: string) =>
  jwt.sign({ userId }, env.jwtSecret, { expiresIn: '15m' });

export const createRefreshToken = (userId: string) =>
  jwt.sign({ userId }, env.jwtRefreshSecret, { expiresIn: '7d' });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.jwtSecret) as { userId: string };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.jwtRefreshSecret) as { userId: string };
