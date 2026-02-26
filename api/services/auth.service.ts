import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {env} from '../config/env';
import {userRepository} from '../repositories/user.repository';
import {ApiError} from '../utils/errors';

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    campus: string;
    role?: 'NORMAL' | 'OFFICER' | 'PRESIDENT' | 'ADMIN';
    roleProofFileId?: string;
    roleProofUrl?: string;
  }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'Email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      campus: data.campus,
      role: data.role ?? 'NORMAL',
      roleProofFileId: data.roleProofFileId,
      roleProofUrl: data.roleProofUrl,
      verificationCode,
      verificationExpiry,
      isVerified: false
    });

    return {id: user.id, email: user.email, verificationCode};
  },

  async verify(email: string, code: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.verificationCode || !user.verificationExpiry) {
      throw new ApiError(400, 'INVALID_CODE', 'Invalid verification code');
    }

    if (
      user.verificationCode !== code ||
      user.verificationExpiry < new Date()
    ) {
      throw new ApiError(
        400,
        'EXPIRED_CODE',
        'Verification code expired or invalid'
      );
    }

    await userRepository.markVerified(email);
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(
        401,
        'INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }

    if (!user.isVerified) {
      throw new ApiError(403, 'NOT_VERIFIED', 'Email not verified');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new ApiError(
        401,
        'INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }

    const accessToken = jwt.sign(
      {userId: user.id, role: user.role},
      env.JWT_SECRET,
      {expiresIn: '15m'}
    );
    const refreshToken = jwt.sign({userId: user.id}, env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });

    return {accessToken, refreshToken};
  }
};
