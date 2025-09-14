import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs-extra';
import { config } from '../config';

// Función para verificar si FFmpeg está disponible
const isFFmpegAvailable = (): boolean => {
  try {
    ffmpeg.getAvailableFormats((err, formats) => {
      if (err) {
        console.warn('⚠️ FFmpeg no está disponible:', err.message);
        return false;
      }
    });
    return true;
  } catch (error) {
    console.warn('⚠️ FFmpeg no está disponible:', error);
    return false;
  }
};

// Función para crear un thumbnail placeholder simple
const createPlaceholderThumbnail = async (
  outputPath: string, 
  width: number = 320, 
  height: number = 180
): Promise<void> => {
  // Crear una imagen PNG simple en base64
  // Esta es una imagen PNG de 1x1 píxel gris que se puede escalar
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const pngBuffer = Buffer.from(pngBase64, 'base64');
  
  await fs.writeFile(outputPath, pngBuffer);
  console.log(`📄 Thumbnail placeholder PNG creado: ${outputPath}`);
};

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  timeOffset?: number; // Tiempo en segundos para extraer el frame
  quality?: number; // 1-31, donde 1 es la mejor calidad
}

export const generateThumbnail = async (
  videoPath: string,
  outputPath: string,
  options: ThumbnailOptions = {}
): Promise<string> => {
  const {
    width = 320,
    height = 180,
    timeOffset = 10, // Extraer frame a los 10 segundos
    quality = 2
  } = options;

  return new Promise((resolve, reject) => {
    // Asegurar que el directorio de thumbnails existe
    fs.ensureDirSync(path.dirname(outputPath));

    // Verificar si FFmpeg está disponible
    if (!isFFmpegAvailable()) {
      console.warn('⚠️ FFmpeg no está disponible, creando thumbnail placeholder');
      // Crear un thumbnail placeholder simple
      createPlaceholderThumbnail(outputPath, width, height)
        .then(() => {
          console.log(`✅ Thumbnail placeholder creado: ${outputPath}`);
          resolve(outputPath);
        })
        .catch(reject);
      return;
    }

    ffmpeg(videoPath)
      .seekInput(timeOffset)
      .frames(1)
      .size(`${width}x${height}`)
      .outputOptions([
        '-q:v', quality.toString(),
        '-f', 'image2'
      ])
      .output(outputPath)
      .on('end', () => {
        console.log(`✅ Thumbnail generado: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('❌ Error generando thumbnail:', err);
        // Si falla, crear un placeholder
        createPlaceholderThumbnail(outputPath, width, height)
          .then(() => {
            console.log(`✅ Thumbnail placeholder creado: ${outputPath}`);
            resolve(outputPath);
          })
          .catch(reject);
      })
      .run();
  });
};

export const generateMultipleThumbnails = async (
  videoPath: string,
  outputDir: string,
  filename: string,
  options: {
    count?: number;
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): Promise<string[]> => {
  const {
    count = 3,
    width = 320,
    height = 180,
    quality = 2
  } = options;

  return new Promise((resolve, reject) => {
    fs.ensureDirSync(outputDir);

    // Obtener duración del video primero
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const duration = metadata.format.duration || 0;
      const interval = duration / (count + 1); // Distribuir thumbnails a lo largo del video

      const thumbnailPromises: Promise<string>[] = [];

      for (let i = 1; i <= count; i++) {
        const timeOffset = interval * i;
        const thumbnailPath = path.join(outputDir, `${filename}_thumb_${i}.jpg`);
        
        thumbnailPromises.push(
          generateThumbnail(videoPath, thumbnailPath, {
            width,
            height,
            timeOffset,
            quality
          })
        );
      }

      Promise.all(thumbnailPromises)
        .then(resolve)
        .catch(reject);
    });
  });
};

export const getVideoDuration = async (videoPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata.format.duration || 0);
    });
  });
};

export const getVideoMetadata = async (videoPath: string): Promise<{
  duration: number;
  width: number;
  height: number;
  fps: number;
  bitrate: number;
}> => {
  return new Promise((resolve, reject) => {
    // Si FFmpeg no está disponible, devolver metadata por defecto
    if (!isFFmpegAvailable()) {
      console.warn('⚠️ FFmpeg no está disponible, usando metadata por defecto');
      resolve({
        duration: 0,
        width: 1920,
        height: 1080,
        fps: 30,
        bitrate: 0
      });
      return;
    }

    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.warn('⚠️ Error obteniendo metadata, usando valores por defecto:', err.message);
        resolve({
          duration: 0,
          width: 1920,
          height: 1080,
          fps: 30,
          bitrate: 0
        });
        return;
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      
      resolve({
        duration: metadata.format.duration || 0,
        width: videoStream?.width || 1920,
        height: videoStream?.height || 1080,
        fps: eval(videoStream?.r_frame_rate || '30') || 30,
        bitrate: parseInt(metadata.format.bit_rate || '0')
      });
    });
  });
};
