import { StorageType, StorageConfig } from '../config/storage';
import { MemoryStorage } from './memoryStorage';
import { JsonFileStorage } from './jsonFileStorage';

export interface VideoStorage {
  initialize(): Promise<void>;
  getAllVideos(): Promise<any[]>;
  getVideoById(id: number): Promise<any | null>;
  addVideo(video: any): Promise<any>;
  deleteVideo(id: number): Promise<boolean>;
  updateVideo(id: number, updates: any): Promise<any | null>;
  getVideoCount(): Promise<number>;
}

export class StorageFactory {
  static create(config: StorageConfig): VideoStorage {
    switch (config.type) {
      case StorageType.MEMORY:
        return new MemoryStorage();
        
      case StorageType.JSON_FILE:
        return new JsonFileStorage(config.dataFile);
        
      case StorageType.SQLITE:
        // TODO: Implementar SQLite storage
        throw new Error('SQLite storage not implemented yet');
        
      case StorageType.MONGODB:
        // TODO: Implementar MongoDB storage
        throw new Error('MongoDB storage not implemented yet');
        
      case StorageType.POSTGRESQL:
        // TODO: Implementar PostgreSQL storage
        throw new Error('PostgreSQL storage not implemented yet');
        
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }
}
