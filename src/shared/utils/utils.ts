import { BadRequestException } from '@nestjs/common';

const imageFileFilter = (req, file, callback) => {
  if (
    !file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|jpe|heic|svg)$/)
  ) {
    return callback(
      new BadRequestException('Only image types are allowed'),
      false,
    );
  }
  callback(null, true);
};

export const imageUploadOptions = {
  fileFilter: imageFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
};

export const pdfUploadOptions = {
  fileFilter: (req, file, callback) => {
    if (!file.originalname.toLowerCase().match(/\.(pdf)$/)) {
      return callback(new BadRequestException('Only PDF is allowed'), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 },
};

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();
