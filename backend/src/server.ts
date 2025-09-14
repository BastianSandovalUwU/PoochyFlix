import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { ensureDirectories } from './utils/fileUtils';
import videoRoutes from './routes/videoRoutes';
import * as videoController from './controllers/videoController';
import { videoService } from './services/videoService';

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDirectories();
  }

  private initializeMiddlewares(): void {
    // CORS
    this.app.use(cors());
    
    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Static files
    this.app.use(express.static('public'));
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/videos', videoRoutes);
    
    // Streaming routes (direct access)
    this.app.use('/videos', videoRoutes);
    this.app.use('/thumbnails', videoRoutes);
    
    // Health check
    this.app.get('/api/test', videoController.getServerStatus);
    
    // Root route
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'PoochyFlix Backend API',
        version: '1.0.0',
        endpoints: {
          videos: '/api/videos',
          upload: '/api/videos/upload',
          stream: '/videos/:filename',
          thumbnails: '/thumbnails/:filename'
        }
      });
    });
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await ensureDirectories(config.videosDir, config.thumbnailsDir);
      console.log(`📁 Videos en: ${config.videosDir}`);
      console.log(`🖼️  Thumbnails en: ${config.thumbnailsDir}`);
      
      // Inicializar el servicio de videos
      await videoService.initialize();
    } catch (error) {
      console.error('Error inicializando directorios:', error);
    }
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`);
      console.log(`📊 Videos encontrados: ${videoService.getVideoCount()}`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

// Inicializar servidor
const server = new Server();
server.start();

export default server;
