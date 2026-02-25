import { ApiError } from './errors';

// I validate the uploaded file to make sure it's safe and within allowed limits
export function validateFile(
  file: Express.Multer.File | undefined,
  allowedTypes: string[],
  maxSize: number,
  allowedExtensions: string[]
) {
  if (!file) {
    throw new ApiError(400, 'FILE_REQUIRED', 'File is required');
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new ApiError(400, 'INVALID_FILE_TYPE', 'File type is not allowed');
  }

  const extension = file.originalname.split('.').pop()?.toLowerCase() ?? '';
  if (!allowedExtensions.includes(`.${extension}`)) {
    throw new ApiError(400, 'INVALID_FILE_EXTENSION', 'File extension is not allowed');
  }

  if (file.size > maxSize) {
    throw new ApiError(400, 'FILE_TOO_LARGE', 'File exceeds maximum size');
  }
}
