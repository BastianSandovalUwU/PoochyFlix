// Configuración de almacenamiento
export enum StorageType {
  MEMORY = 'memory',
  JSON_FILE = 'json_file',
  SQLITE = 'sqlite',
  MONGODB = 'mongodb',
  POSTGRESQL = 'postgresql'
}

export interface StorageConfig {
  type: StorageType;
  connectionString?: string;
  dataFile?: string;
}

// Configuración por defecto - Almacenamiento en memoria
export const defaultStorageConfig: StorageConfig = {
  type: StorageType.MEMORY,
  dataFile: './data/videos.json' // Solo para JSON_FILE
};
