import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });

    const accessToken = createAccessToken(String(user._id));
    const refreshToken = createRefreshToken(String(user._id));

    return res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = createAccessToken(String(user._id));
    const refreshToken = createRefreshToken(String(user._id));

    return res.json({
      user: { id: user._id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const accessToken = createAccessToken(payload.userId);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to load profile' });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { email, name, password, avatarUrl } = req.body;
    const update: any = {};
    if (email) update.email = email;
    if (name !== undefined) update.name = name;
    if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;
    if (password) {
      const bcrypt = await import('bcryptjs');
      update.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const file = req.file as Express.Multer.File;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const filename = file.filename || file.originalname;
    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    const user = await User.findByIdAndUpdate(userId, { avatarUrl: url }, { new: true }).select('-passwordHash');
    return res.json({ avatarUrl: url, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to upload avatar' });
  }
};
