import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import mime from 'mime-types';
import { config } from '../config';
import { getVideoMimeType } from '../utils/fileUtils';

export const streamVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(config.videosDir, filename);
    
    if (!(await fs.pathExists(filePath))) {
      res.status(404).json({ error: 'Archivo no encontrado' });
      return;
    }

    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Streaming con soporte para range requests
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': getVideoMimeType(filename),
      };
      
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Descarga completa
      const head = {
        'Content-Length': fileSize,
        'Content-Type': getVideoMimeType(filename),
      };
      
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: 'Error al reproducir el video' });
  }
};

export const serveThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(config.thumbnailsDir, filename);
    
    if (await fs.pathExists(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Thumbnail no encontrado' });
    }
  } catch (error) {
    console.error('Error serving thumbnail:', error);
    res.status(500).json({ error: 'Error al servir la miniatura' });
  }
};
