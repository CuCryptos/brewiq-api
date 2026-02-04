import { cloudinary } from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export const uploadService = {
  async uploadImage(
    base64Data: string,
    folder: string = 'brewiq',
  ): Promise<UploadResult> {
    try {
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64Data}`,
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
      );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error) {
      logger.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  async uploadFromUrl(url: string, folder: string = 'brewiq'): Promise<UploadResult> {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error) {
      logger.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      logger.error('Cloudinary delete error:', error);
      throw error;
    }
  },

  getOptimizedUrl(publicId: string, options: { width?: number; height?: number } = {}): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width: options.width, height: options.height, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });
  },
};
