import { Video } from '../types';
import { scanVideoFiles } from '../utils/fileUtils';
import { config } from '../config';

// Almacenamiento en memoria (implementación actual)
export class MemoryStorage {
  private videos: Video[] = [];

  async initialize(): Promise<void> {
    this.videos = await scanVideoFiles(config.videosDir);
    console.log(`📊 Videos cargados en memoria: ${this.videos.length}`);
  }

  async getAllVideos(): Promise<Video[]> {
    return [...this.videos];
  }

  async getVideoById(id: number): Promise<Video | null> {
    return this.videos.find(v => v.id === id) || null;
  }

  async addVideo(video: Omit<Video, 'id'>): Promise<Video> {
    const newVideo: Video = {
      ...video,
      id: this.videos.length + 1
    };
    this.videos.push(newVideo);
    return newVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const index = this.videos.findIndex(v => v.id === id);
    if (index === -1) return false;
    
    this.videos.splice(index, 1);
    return true;
  }

  async updateVideo(id: number, updates: Partial<Video>): Promise<Video | null> {
    const index = this.videos.findIndex(v => v.id === id);
    if (index === -1) return null;
    
    this.videos[index] = { ...this.videos[index], ...updates };
    return this.videos[index];
  }

  async getVideoCount(): Promise<number> {
    return this.videos.length;
  }
}
