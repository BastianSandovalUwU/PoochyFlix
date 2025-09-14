import axios, { AxiosResponse, AxiosProgressEvent } from 'axios';
import { Video, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const videoAPI = {
  // Obtener todos los videos
  getVideos: (): Promise<AxiosResponse<ApiResponse<Video[]>>> => 
    api.get('/videos'),
  
  // Obtener un video específico
  getVideo: (id: number): Promise<AxiosResponse<ApiResponse<Video>>> => 
    api.get(`/videos/${id}`),
  
  // Subir un nuevo video
  uploadVideo: (
    formData: FormData, 
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<AxiosResponse<ApiResponse<Video>>> => 
    api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    }),
  
  // Eliminar un video
  deleteVideo: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/videos/${id}`),
  
  // Generar thumbnail para un video
  generateThumbnail: (id: number): Promise<AxiosResponse<ApiResponse<{ thumbnail: string }>>> => 
    api.post(`/videos/${id}/thumbnail`),
  
  // Generar thumbnails para todos los videos
  generateAllThumbnails: (): Promise<AxiosResponse<ApiResponse>> => 
    api.post('/videos/thumbnails/generate-all'),
  
  // Actualizar metadata de un video
  updateVideoMetadata: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.put(`/videos/${id}/metadata`),
};

export const streamAPI = {
  // URL para streaming de video
  getStreamUrl: (filename: string): string => 
    `${API_BASE_URL}/videos/stream/${filename}`,
  
  // URL para thumbnails
  getThumbnailUrl: (filename: string): string => 
    `${API_BASE_URL}/videos/thumbnails/${filename}`,
};

export default api;
