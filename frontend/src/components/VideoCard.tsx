import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay, FaInfoCircle, FaImage } from 'react-icons/fa';
import { streamAPI, videoAPI } from '../services/api';
import { VideoCardProps } from '../types';

const Card = styled.div`
  position: relative;
  width: 300px;
  height: 168px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: #333;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    z-index: 10;
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 140px;
  }
`;

interface ThumbnailProps {
  thumbnail: string | null;
}

const Thumbnail = styled.div<ThumbnailProps>`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #333, #555);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #666;
  background-image: ${props => props.thumbnail ? `url(${props.thumbnail})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.info {
    background: rgba(109, 109, 110, 0.7);
    color: white;
  }
`;

const VideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px 16px 16px;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: translateY(0);
  }
`;

const Title = styled.h3`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Metadata = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  display: flex;
  gap: 12px;
`;

const PlayIcon = styled.div`
    font-size: 24px;
    color: #e50914;
`;

const PlaceholderThumbnail = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #333, #555);
    color: white;
`;

const PlaceholderText = styled.div`
    font-size: 16px;
    font-weight: 600;
    margin-top: 8px;
    color: white;
`;

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
    <Card onClick={handlePlay}>
      <Thumbnail 
        thumbnail={
          video.thumbnail && !thumbnailError 
            ? streamAPI.getThumbnailUrl(video.thumbnail) 
            : null
        }
        onError={() => setThumbnailError(true)}
      >
        {(!video.thumbnail || thumbnailError) && (
          <PlaceholderThumbnail>
            <PlayIcon>🎬</PlayIcon>
            <PlaceholderText>VIDEO</PlaceholderText>
          </PlaceholderThumbnail>
        )}
      </Thumbnail>

      <Overlay>
        <ActionButton onClick={handlePlay}>
          <FaPlay color="#000" />
        </ActionButton>
        {!video.thumbnail && (
          <ActionButton 
            onClick={handleGenerateThumbnail}
            disabled={generatingThumbnail}
            title="Generar thumbnail"
          >
            {generatingThumbnail ? '⏳' : <FaImage color="#000" />}
          </ActionButton>
        )}
        <ActionButton className="info" onClick={handleInfo}>
          <FaInfoCircle />
        </ActionButton>
      </Overlay>

      <VideoInfo>
        <Title>{video.title}</Title>
        <Metadata>
          <span>{formatFileSize(video.size)}</span>
          <span>{formatDate(video.uploadDate)}</span>
        </Metadata>
      </VideoInfo>
    </Card>
  );
}

export default VideoCard;
