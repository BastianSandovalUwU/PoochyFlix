import fs from 'fs-extra';
import path from 'path';
import { Video } from '../types';
import { scanVideoFiles } from '../utils/fileUtils';
import { config } from '../config';

// Almacenamiento en archivo JSON (persistente)
export class JsonFileStorage {
  private dataFile: string;
  private videos: Video[] = [];

  constructor(dataFile: string = './data/videos.json') {
    this.dataFile = dataFile;
  }

  async initialize(): Promise<void> {
    // Crear directorio si no existe
    await fs.ensureDir(path.dirname(this.dataFile));
    
    // Cargar datos existentes o escanear archivos
    if (await fs.pathExists(this.dataFile)) {
      await this.loadFromFile();
    } else {
      // Primera vez - escanear archivos físicos
      this.videos = await scanVideoFiles(config.videosDir);
      await this.saveToFile();
    }
    
    console.log(`📊 Videos cargados desde JSON: ${this.videos.length}`);
  }

  private async loadFromFile(): Promise<void> {
    const data = await fs.readJson(this.dataFile);
    this.videos = data.videos || [];
  }

  private async saveToFile(): Promise<void> {
    const data = {
      videos: this.videos,
      lastUpdated: new Date().toISOString()
    };
    await fs.writeJson(this.dataFile, data, { spaces: 2 });
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
      id: Math.max(...this.videos.map(v => v.id), 0) + 1
    };
    
    this.videos.push(newVideo);
    await this.saveToFile();
    return newVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const index = this.videos.findIndex(v => v.id === id);
    if (index === -1) return false;
    
    this.videos.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  async updateVideo(id: number, updates: Partial<Video>): Promise<Video | null> {
    const index = this.videos.findIndex(v => v.id === id);
    if (index === -1) return null;
    
    this.videos[index] = { ...this.videos[index], ...updates };
    await this.saveToFile();
    return this.videos[index];
  }

  async getVideoCount(): Promise<number> {
    return this.videos.length;
  }

  // Método para sincronizar con archivos físicos
  async syncWithFiles(): Promise<void> {
    const physicalFiles = await scanVideoFiles(config.videosDir);
    
    // Agregar nuevos archivos que no están en la base de datos
    for (const file of physicalFiles) {
      const exists = this.videos.some(v => v.filename === file.filename);
      if (!exists) {
        await this.addVideo(file);
      }
    }
    
    // Remover archivos que ya no existen físicamente
    this.videos = this.videos.filter(video => {
      const physicalFile = physicalFiles.find(f => f.filename === video.filename);
      return !!physicalFile;
    });
    
    await this.saveToFile();
  }
}
