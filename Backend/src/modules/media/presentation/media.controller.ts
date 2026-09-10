import { Request, Response, NextFunction } from 'express';
import { s3StorageService } from '../../../shared/infrastructure/storage/s3-storage.service.js';

export class MediaController {
  public getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileName, mimeType, folder } = req.query;

      if (!fileName || !mimeType) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Query parameters fileName and mimeType are required.',
            statusCode: 400,
          },
        });
      }

      const result = await s3StorageService.getPresignedUploadUrl(
        String(fileName),
        String(mimeType),
        folder ? String(folder) : 'media'
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileName, mimeType, base64Data, folder } = req.body;

      if (!fileName || !mimeType || !base64Data) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'fileName, mimeType, and base64Data payload are required.',
            statusCode: 400,
          },
        });
      }

      const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileUrl = await s3StorageService.uploadFile({
        buffer,
        fileName,
        mimeType,
        folder: folder || 'media',
      });

      res.status(201).json({
        success: true,
        data: {
          fileUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
