import crypto from 'crypto';

// I generate secure random tokens for invite links
export function generateToken(size = 32) {
  return crypto.randomBytes(size).toString('hex');
}
