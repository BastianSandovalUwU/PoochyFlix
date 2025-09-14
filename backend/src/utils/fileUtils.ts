import fs from 'fs-extra';
import path from 'path';
import { Video } from '../types';

export const ensureDirectories = async (videosDir: string, thumbnailsDir: string): Promise<void> => {
  await fs.ensureDir(videosDir);
  await fs.ensureDir(thumbnailsDir);
};

export const scanVideoFiles = async (videosDir: string): Promise<Video[]> => {
  const videos: Video[] = [];
  
  try {
    const files = await fs.readdir(videosDir);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(videosDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile() && /\.(mp4|avi|mov|mkv|webm)$/i.test(file)) {
        videos.push({
          id: i + 1,
          title: path.parse(file).name,
          filename: file,
          size: stats.size,
          duration: 0, // Se calculará después
          thumbnail: null,
          uploadDate: stats.birthtime,
          path: `/videos/${file}`
        });
      }
    }
  } catch (error) {
    console.error('Error scanning video files:', error);
  }
  
  return videos;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidVideoFile = (filename: string): boolean => {
  return /\.(mp4|avi|mov|mkv|webm)$/i.test(filename);
};

export const getVideoMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.avi': 'video/avi',
    '.mov': 'video/mov',
    '.mkv': 'video/mkv',
    '.webm': 'video/webm'
  };
  return mimeTypes[ext] || 'video/mp4';
};
