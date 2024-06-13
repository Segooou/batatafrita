/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { badRequest, messageErrorResponse } from '../api-response';
import { errorLogger } from '../error-logger';
import { existsSync, mkdirSync } from 'fs';
import { messages } from '../../../domain/helpers';
import multer, { MulterError, diskStorage } from 'multer';
import path from 'path';
import type { Controller } from '../../../domain/protocols';
import type { NextFunction, Request, Response } from 'express';

const checkTempStorageDir = (): void => {
  const dirPath = path.join(__dirname, '..', '..', '..', 'static', 'uploads');

  if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
};

const storage = diskStorage({
  destination(req, file, cb) {
    const { folder } = req.body;

    if (folder === 'homem' || folder === 'mulher' || folder === 'assinatura') {
      cb(null, path.join(__dirname, '..', '..', '..', 'static', 'uploads', folder));
      return;
    }

    cb(null, path.join(__dirname, '..', '..', '..', 'static', 'uploads'));
  },
  filename(req, file, cb) {
    checkTempStorageDir();

    if (file) {
      const randomString = String(Math.random()).replace('0.', '');

      const ext = path.extname(file.originalname);

      const fileName = `${randomString}_${Date.now()}${ext}`;

      cb(null, fileName);
    }
  }
});

const fileFilter = (req: any, file: any, cb: any): void => {
  if (String(file?.mimetype)?.startsWith('image/')) cb(null, true);
  else cb(new MulterError('LIMIT_UNEXPECTED_FILE'), true);
};

export const uploadFilesMiddleware = multer({
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  storage
}).array('images');

export const uploadOneFileMiddleware = multer({
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  storage
}).single('image');

export const handleMulterError = (
  err: Error,
  req: Request,
  response: Response,
  next: NextFunction
) => {
  if (err instanceof MulterError)
    return badRequest({
      message: messages.default.uploadError(err.message),
      response
    });

  next();
};

export const insertImage: Controller =
  () => (request: Request, response: Response, next: NextFunction) => {
    try {
      let filename: string | undefined;
      const { folder } = request.body;

      if (request.file?.filename)
        if (folder === 'homem' || folder === 'mulher' || folder === 'assinatura')
          filename = `${request.protocol}://${request.get('host') ?? ''}/static/uploads/${String(
            folder
          )}/${request.file.filename}`;
        else
          filename = `${request.protocol}://${request.get('host') ?? ''}/static/uploads/${
            request.file.filename
          }`;

      if (typeof filename === 'string')
        Object.assign(request, {
          body: { ...request.body, filename: request?.file?.filename ?? '', image: filename }
        });

      next();
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
