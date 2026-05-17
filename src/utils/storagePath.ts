import path from 'path';

const sanitizeStorageName = (value: string, fallback: string): string => {
  const sanitizedValue = value
    .normalize('NFKD') // decompose accented letters into base letter + mark
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // remove reserved path characters and control chars
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, '-') // replace non-alphanumeric runs except apostrophes with a hyphen
    .replace(/^-+|-+$/g, ''); // trim hyphens from the start or end

  return sanitizedValue || fallback;
};

const buildStoragePath = (
  entityName: string,
  originalFileName: string,
): string => {
  const extension = path.extname(originalFileName);
  const folderName = sanitizeStorageName(entityName, 'entity');
  const fileName = sanitizeStorageName(
    path.basename(originalFileName, extension),
    'file',
  );

  return `${folderName}/${fileName}${extension}`;
};

export { buildStoragePath };
