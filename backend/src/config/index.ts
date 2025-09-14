import { ServerConfig, StorageType } from './storage';

// Cargar variables de entorno
const PORT = parseInt(process.env.PORT || '5000', 10);
const STORAGE_TYPE = (process.env.STORAGE_TYPE as StorageType) || StorageType.MEMORY;

export const config: ServerConfig = {
  port: PORT,
  videosDir: process.env.VIDEOS_DIR || './videos',
  thumbnailsDir: process.env.THUMBNAILS_DIR || './thumbnails',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '2147483648', 10), // 2GB
  allowedMimeTypes: [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/mkv',
    'video/webm'
  ],
  storageType: STORAGE_TYPE,
  dataFile: process.env.DATA_FILE || './data/videos.json',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
};