import { BadRequestException } from '@nestjs/common';

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|jpe|heic)$/)) {
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
