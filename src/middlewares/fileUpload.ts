import multer from 'multer';
import path from 'path';
import type { Express } from 'express';

const memoryStorage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'));
  }
};

export const validateAudioUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
});

// Separate utility for saving files to disk
export const saveAudioFile = (buffer: Buffer, originalName: string): string => {
  const fs = require('fs');
  const uploadsDir = path.join(process.cwd(), 'uploads', 'songs');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const uniqueName = `${Date.now()}-${originalName}`;
  const filePath = path.join(uploadsDir, uniqueName);

  fs.writeFileSync(filePath, buffer);

  return uniqueName;
};
