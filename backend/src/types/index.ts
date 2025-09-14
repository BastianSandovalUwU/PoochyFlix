export interface Video {
  id: number;
  title: string;
  filename: string;
  size: number;
  duration: number;
  thumbnail: string | null;
  uploadDate: Date;
  path: string;
}

export interface VideoUploadRequest {
  title?: string;
  video: Express.Multer.File;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
}

export interface VideoMetadata {
  duration?: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface StreamRange {
  start: number;
  end: number;
  fileSize: number;
}

export interface ServerConfig {
  port: number;
  videosDir: string;
  thumbnailsDir: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  storageType?: string;
  dataFile?: string;
  corsOrigin?: string;
  rateLimitWindowMs?: number;
  rateLimitMaxRequests?: number;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
}
