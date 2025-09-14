import { Request, Response } from 'express';
import { videoService } from '../services/videoService';
import { ApiResponse, Video } from '../types';
import { config } from '../config';

export const getAllVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = videoService.getAllVideos();
    const response: ApiResponse<Video[]> = {
      success: true,
      data: videos
    };
    res.json(response);
  } catch (error) {
    console.error('Error getting videos:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Error al obtener los videos'
    };
    res.status(500).json(response);
  }
};

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id || '0');
    
    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: 'ID de video inválido'
      };
      res.status(400).json(response);
      return;
    }

    const video = videoService.getVideoById(id);
    
    if (!video) {
      const response: ApiResponse = {
        success: false,
        error: 'Video no encontrado'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Video> = {
      success: true,
      data: video
    };
    res.json(response);
  } catch (error) {
    console.error('Error getting video:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Error al obtener el video'
    };
    res.status(500).json(response);
  }
};

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      const response: ApiResponse = {
        success: false,
        error: 'No se subió ningún archivo'
      };
      res.status(400).json(response);
      return;
    }

    const title = req.body.title || req.file.originalname?.replace(/\.[^/.]+$/, "") || 'Video sin título';
    
    const newVideo = await videoService.addVideo({
      title,
      filename: req.file.filename,
      size: req.file.size,
      duration: 0,
      thumbnail: null,
      uploadDate: new Date(),
      path: `/videos/${req.file.filename}`
    });

    // Generar thumbnail automáticamente
    try {
      const thumbnailFilename = await videoService.generateThumbnailForVideo(newVideo.id);
      if (thumbnailFilename) {
        newVideo.thumbnail = thumbnailFilename;
      }
    } catch (thumbnailError) {
      console.error('Error generando thumbnail automáticamente:', thumbnailError);
      // No fallar la subida si el thumbnail falla
    }

    const response: ApiResponse<Video> = {
      success: true,
      data: newVideo,
      message: 'Video subido exitosamente'
    };
    res.json(response);
  } catch (error) {
    console.error('Error uploading video:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Error al subir el video'
    };
    res.status(500).json(response);
  }
};

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id || '0');
    
    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: 'ID de video inválido'
      };
      res.status(400).json(response);
      return;
    }

    const deleted = await videoService.deleteVideo(id);
    
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Video no encontrado'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Video eliminado exitosamente'
    };
    res.json(response);
  } catch (error) {
    console.error('Error deleting video:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Error al eliminar el video'
    };
    res.status(500).json(response);
  }
};

export const getServerStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Backend funcionando correctamente',
        videosCount: videoService.getVideoCount(),
        timestamp: new Date().toISOString(),
        config: {
          videosDir: config.videosDir,
          thumbnailsDir: config.thumbnailsDir,
          maxFileSize: config.maxFileSize,
          allowedMimeTypes: config.allowedMimeTypes
        }
      }
    };
    res.json(response);
  } catch (error) {
    console.error('Error getting server status:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Error al obtener el estado del servidor'
    };
    res.status(500).json(response);
  }
};

export const getVideoCount = (): number => {
  return videoService.getVideoCount();
};

export const generateThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = parseInt(req.params.id || '0');
    
    if (isNaN(videoId)) {
      res.status(400).json({
        success: false,
        error: 'ID de video inválido'
      });
      return;
    }

    const thumbnailFilename = await videoService.generateThumbnailForVideo(videoId);
    
    if (thumbnailFilename) {
      res.json({
        success: true,
        data: { thumbnail: thumbnailFilename },
        message: 'Thumbnail generado exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error generando thumbnail'
      });
    }
  } catch (error) {
    console.error('Error en generateThumbnail:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const generateAllThumbnails = async (req: Request, res: Response): Promise<void> => {
  try {
    await videoService.generateThumbnailsForAllVideos();
    
    res.json({
      success: true,
      message: 'Thumbnails generados para todos los videos'
    });
  } catch (error) {
    console.error('Error en generateAllThumbnails:', error);
    res.status(500).json({
      success: false,
      error: 'Error generando thumbnails'
    });
  }
};

export const updateVideoMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = parseInt(req.params.id || '0');
    
    if (isNaN(videoId)) {
      res.status(400).json({
        success: false,
        error: 'ID de video inválido'
      });
      return;
    }

    await videoService.updateVideoMetadata(videoId);
    
    res.json({
      success: true,
      message: 'Metadata del video actualizada'
    });
  } catch (error) {
    console.error('Error en updateVideoMetadata:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando metadata'
    });
  }
};
