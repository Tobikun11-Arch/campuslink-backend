import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {env} from '../config/env';
import {userRepository} from '../repositories/user.repository';
import {ApiError} from '../utils/errors';
import {uploadToAppwrite} from './appwrite.service';
import {validateFile} from '../utils/fileValidation';
import {emailService} from './email.service';
import {verificationCodeEmailTemplate} from '../templates/verificationCodeEmail';

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getVerificationExpiry(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export const authService = {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    campus: string;
    role?: 'NORMAL' | 'OFFICER' | 'PRESIDENT' | 'ADMIN';
    roleProof?: Express.Multer.File;
  }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'Email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const verificationCode = generateVerificationCode();
    const verificationExpiry = getVerificationExpiry(15);

    const role = data.role ?? 'NORMAL';
    const needsProof = role === 'OFFICER' || role === 'PRESIDENT';
    const allowedTypes = ['image/jpeg', 'image/png'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    let roleProofFileId: string | undefined;
    let roleProofUrl: string | undefined;

    if (needsProof) {
      validateFile(
        data.roleProof,
        allowedTypes,
        5 * 1024 * 1024,
        allowedExtensions
      );
      const upload = await uploadToAppwrite(data.roleProof!);
      roleProofFileId = upload.fileId;
      roleProofUrl = upload.fileUrl;
    }

    const user = await userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      campus: data.campus,
      role,
      roleProofFileId,
      roleProofUrl,
      verificationCode,
      verificationExpiry,
      isVerified: false
    });

    const emailTpl = verificationCodeEmailTemplate({
      code: verificationCode,
      expiresMinutes: 15,
      recipientName: data.firstName
    });

    await emailService.sendEmail({
      to: data.email,
      subject: emailTpl.subject,
      text: emailTpl.text,
      html: emailTpl.html
    });

    return {id: user.id, email: user.email};
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

  async resendVerification(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    if (user.isVerified) {
      throw new ApiError(400, 'ALREADY_VERIFIED', 'Email already verified');
    }

    const verificationCode = generateVerificationCode();
    const verificationExpiry = getVerificationExpiry(15);
    await userRepository.updateVerification(
      email,
      verificationCode,
      verificationExpiry
    );

    const emailTpl = verificationCodeEmailTemplate({
      code: verificationCode,
      expiresMinutes: 15,
      recipientName: user.firstName
    });

    await emailService.sendEmail({
      to: email,
      subject: emailTpl.subject,
      text: emailTpl.text,
      html: emailTpl.html
    });
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
  },
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        userId: string;
      };

      const user = await userRepository.findById(payload.userId);
      if (!user) {
        throw new ApiError(401, 'UNAUTHORIZED', 'Invalid token');
      }

      if (!user.isVerified) {
        throw new ApiError(403, 'NOT_VERIFIED', 'Email not verified');
      }

      const accessToken = jwt.sign(
        {userId: user.id, role: user.role},
        env.JWT_SECRET,
        {expiresIn: '15m'}
      );

      return {accessToken};
    } catch {
      throw new ApiError(401, 'UNAUTHORIZED', 'Invalid token');
    }
  }
};
