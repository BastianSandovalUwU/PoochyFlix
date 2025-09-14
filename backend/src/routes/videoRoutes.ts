import { Router } from 'express';
import { upload } from '../middleware/upload';
import * as videoController from '../controllers/videoController';
import * as streamController from '../controllers/streamController';

const router = Router();

// Rutas de la API
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.delete('/:id', videoController.deleteVideo);

// Rutas de streaming
router.get('/stream/:filename', streamController.streamVideo);
router.get('/thumbnails/:filename', streamController.serveThumbnail);

// Rutas de thumbnails y metadata
router.post('/:id/thumbnail', videoController.generateThumbnail);
router.post('/thumbnails/generate-all', videoController.generateAllThumbnails);
router.put('/:id/metadata', videoController.updateVideoMetadata);

// Ruta para rescanear videos
router.post('/rescan', videoController.rescanVideos);

export default router;
