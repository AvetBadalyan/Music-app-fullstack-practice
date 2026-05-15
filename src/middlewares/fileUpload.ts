import multer from 'multer';
import type { Request } from 'express';

const memoryStorage = multer.memoryStorage();

const makeMimePrefixFilter =
  (allowedPrefix: string, rejectionMessage: string) =>
  (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith(allowedPrefix)) {
      cb(null, true);
    } else {
      cb(new Error(rejectionMessage));
    }
  };

export const validateAudioUpload = multer({
  storage: memoryStorage,
  fileFilter: makeMimePrefixFilter('audio/', 'Only audio files are allowed!'),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
});

export const validateImageUpload = multer({
  storage: memoryStorage,
  fileFilter: makeMimePrefixFilter('image/', 'Only image files are allowed!'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
