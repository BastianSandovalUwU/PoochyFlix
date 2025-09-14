import fs from 'fs-extra';
import path from 'path';
import { Video, ApiResponse } from '../types';
import { scanVideoFiles } from '../utils/fileUtils';
import { generateThumbnail, getVideoMetadata } from '../utils/thumbnailUtils';
import { config } from '../config';

class VideoService {
  private videos: Video[] = [];
  private initialized: boolean = false;

  constructor() {
    // No inicializar automáticamente en el constructor
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.videos = await scanVideoFiles(config.videosDir);
      this.initialized = true;
      console.log(`📊 Videos encontrados: ${this.videos.length}`);
    } catch (error) {
      console.error('Error inicializando videos:', error);
      this.initialized = true; // Marcar como inicializado para evitar loops
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  public getAllVideos(): Video[] {
    return [...this.videos];
  }

  public getVideoById(id: number): Video | undefined {
    return this.videos.find(video => video.id === id);
  }

  public async addVideo(videoData: Omit<Video, 'id'>): Promise<Video> {
    await this.ensureInitialized();
    
    const newVideo: Video = {
      ...videoData,
      id: Math.max(...this.videos.map(v => v.id), 0) + 1
    };
    
    this.videos.push(newVideo);
    return newVideo;
  }

  public async deleteVideo(id: number): Promise<boolean> {
    await this.ensureInitialized();
    
    const videoIndex = this.videos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return false;
    }

    const video = this.videos[videoIndex];
    
    if (!video) {
      return false;
    }
    
    try {
      // Eliminar archivo de video
      const videoPath = path.join(config.videosDir, video.filename);
      if (await fs.pathExists(videoPath)) {
        await fs.remove(videoPath);
      }

      // Eliminar thumbnail si existe
      const thumbnailPath = path.join(config.thumbnailsDir, `${video.id}.jpg`);
      if (await fs.pathExists(thumbnailPath)) {
        await fs.remove(thumbnailPath);
      }

      // Eliminar de la lista
      this.videos.splice(videoIndex, 1);
      return true;
    } catch (error) {
      console.error('Error eliminando video:', error);
      return false;
    }
  }

  public async updateVideo(id: number, updates: Partial<Video>): Promise<Video | null> {
    await this.ensureInitialized();
    
    const videoIndex = this.videos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return null;
    }

    const existingVideo = this.videos[videoIndex];
    if (!existingVideo) {
      return null;
    }
    
    const updatedVideo = { ...existingVideo, ...updates };
    this.videos[videoIndex] = updatedVideo;
    return updatedVideo;
  }

  public getVideoCount(): number {
    return this.videos.length;
  }

  private saveVideos(): void {
    // En una implementación real, aquí guardarías en la base de datos
    // Por ahora solo mantenemos en memoria
    console.log(`💾 Guardando ${this.videos.length} videos en memoria`);
  }

  public async rescanVideos(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }

  public async generateThumbnailForVideo(videoId: number): Promise<string | null> {
    await this.ensureInitialized();
    
    const video = this.videos.find(v => v.id === videoId);
    if (!video) {
      throw new Error('Video no encontrado');
    }

    try {
      const videoPath = path.join(config.videosDir, video.filename);
      const thumbnailFilename = `${path.parse(video.filename).name}_thumb.jpg`;
      const thumbnailPath = path.join(config.thumbnailsDir, thumbnailFilename);

      await generateThumbnail(videoPath, thumbnailPath, {
        width: 320,
        height: 180,
        timeOffset: 10,
        quality: 2
      });

      // Actualizar el video con el thumbnail
      video.thumbnail = thumbnailFilename;
      this.saveVideos();

      console.log(`✅ Thumbnail generado para video ${videoId}: ${thumbnailFilename}`);
      return thumbnailFilename;
    } catch (error) {
      console.error(`❌ Error generando thumbnail para video ${videoId}:`, error);
      return null;
    }
  }

  public async generateThumbnailsForAllVideos(): Promise<void> {
    await this.ensureInitialized();
    
    console.log('🖼️ Generando thumbnails para todos los videos...');
    
    for (const video of this.videos) {
      if (!video.thumbnail) {
        try {
          await this.generateThumbnailForVideo(video.id);
        } catch (error) {
          console.error(`Error generando thumbnail para ${video.title}:`, error);
        }
      }
    }
    
    console.log('✅ Thumbnails generados para todos los videos');
  }

  public async updateVideoMetadata(videoId: number): Promise<void> {
    await this.ensureInitialized();
    
    const video = this.videos.find(v => v.id === videoId);
    if (!video) {
      throw new Error('Video no encontrado');
    }

    try {
      const videoPath = path.join(config.videosDir, video.filename);
      const metadata = await getVideoMetadata(videoPath);
      
      // Actualizar metadata del video
      video.duration = metadata.duration;
      
      this.saveVideos();
      console.log(`✅ Metadata actualizada para video ${videoId}`);
    } catch (error) {
      console.error(`❌ Error actualizando metadata para video ${videoId}:`, error);
    }
  }
}

export const videoService = new VideoService();
