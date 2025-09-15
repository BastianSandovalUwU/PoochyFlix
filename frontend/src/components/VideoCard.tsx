import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaImage } from 'react-icons/fa';
import { streamAPI, videoAPI } from '../services/api';
import { VideoCardProps } from '../types';


const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const [thumbnailError, setThumbnailError] = useState<boolean>(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState<boolean>(false);

  const handlePlay = (e: React.MouseEvent): void => {
    e.stopPropagation();
    navigate(`/video/${video.id}`);
  };

  const handleInfo = (e: React.MouseEvent): void => {
    e.stopPropagation();
    // Aquí podrías abrir un modal con más información
    console.log('Video info:', video);
  };

  const handleGenerateThumbnail = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    
    if (generatingThumbnail) return;
    
    try {
      setGeneratingThumbnail(true);
      const response = await videoAPI.generateThumbnail(video.id);
      
      if (response.data.success) {
        // Recargar la página para mostrar el nuevo thumbnail
        window.location.reload();
      }
    } catch (error) {
      console.error('Error generando thumbnail:', error);
      alert('Error generando thumbnail. Inténtalo de nuevo.');
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={handlePlay}
      className="relative w-80 h-44 md:w-64 md:h-36 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 bg-netflix-gray hover:scale-105 hover:shadow-2xl hover:shadow-black/50 hover:z-10"
    >
      <div 
        className={`w-full h-full bg-gradient-to-br from-netflix-gray to-gray-600 flex items-center justify-center text-5xl text-gray-500 bg-cover bg-center bg-no-repeat ${
          video.thumbnail && !thumbnailError 
            ? 'bg-[url(' + streamAPI.getThumbnailUrl(video.thumbnail) + ')]' 
            : ''
        }`}
        onError={() => setThumbnailError(true)}
      >
        {(!video.thumbnail || thumbnailError) && (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-netflix-gray to-gray-600 text-white">
            <div className="text-2xl text-netflix-red">🎬</div>
            <div className="text-base font-semibold mt-2 text-white">VIDEO</div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-5 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handlePlay}
          className="bg-white/90 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
        >
          <FaPlay color="#000" />
        </button>
        {!video.thumbnail && (
          <button 
            onClick={handleGenerateThumbnail}
            disabled={generatingThumbnail}
            title="Generar thumbnail"
            className="bg-white/90 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 disabled:opacity-50"
          >
            {generatingThumbnail ? '⏳' : <FaImage color="#000" />}
          </button>
        )}
        <button 
          onClick={handleInfo}
          className="bg-gray-600/70 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 text-white"
        >
          <FaInfoCircle />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pb-4 transform translate-y-full hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white text-base font-semibold mb-1 truncate">
          {video.title}
        </h3>
        <div className="text-netflix-light-gray text-xs flex gap-3">
          <span>{formatFileSize(video.size)}</span>
          <span>{formatDate(video.uploadDate)}</span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
