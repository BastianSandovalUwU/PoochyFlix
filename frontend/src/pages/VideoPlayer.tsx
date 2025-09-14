import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { videoAPI, streamAPI } from '../services/api';
import { Video } from '../types';

const Container = styled.div`
  min-height: 100vh;
  background-color: #000000;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent);
  display: flex;
  align-items: center;
  padding: 0 4%;
  z-index: 1000;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #b3b3b3;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #000000;
`;

const PlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

interface ControlsOverlayProps {
  visible: boolean;
}

const ControlsOverlay = styled.div<ControlsOverlayProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 40px 4%;
  z-index: 100;
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity 0.3s ease;
`;

const VideoInfo = styled.div`
  margin-bottom: 20px;
`;

const VideoTitle = styled.h1`
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const VideoMetadata = styled.div`
  color: #b3b3b3;
  font-size: 16px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #ffffff;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ProgressContainer = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
`;

interface ProgressProps {
  percent: number;
}

const Progress = styled.div<ProgressProps>`
  height: 100%;
  background: #e50914;
  border-radius: 3px;
  width: ${props => props.percent}%;
  transition: width 0.1s ease;
`;

const TimeDisplay = styled.div`
  color: #ffffff;
  font-size: 14px;
  min-width: 80px;
  text-align: center;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #e50914;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #ffffff;
  font-size: 18px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #e50914;
  font-size: 18px;
  text-align: center;
  padding: 20px;
`;

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [played, setPlayed] = useState<number>(0);
  const [seeking, setSeeking] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const fetchVideo = useCallback(async (): Promise<void> => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await videoAPI.getVideo(parseInt(id));
      const videoData = response.data.data || null;
      console.log('Video data:', videoData);
      if (videoData) {
        console.log('Stream URL:', streamAPI.getStreamUrl(videoData.filename));
      }
      setVideo(videoData);
    } catch (err) {
      console.error('Error fetching video:', err);
      setError('Error al cargar el video');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (playing) {
        setControlsVisible(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [playing]);

  const handlePlayPause = (): void => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMute = (): void => {
    setMuted(!muted);
  };

  const handleProgress = (state: { played: number }): void => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekChange = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setPlayed(pos);
  };

  const handleSeekMouseDown = (): void => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (): void => {
    setSeeking(false);
  };

  const handleDuration = (duration: number): void => {
    setDuration(duration);
  };

  const formatTime = (seconds: number): string => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleMouseMove = (): void => {
    setControlsVisible(true);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Cargando video...</LoadingContainer>
      </Container>
    );
  }

  if (error || !video) {
    return (
      <Container>
        <ErrorContainer>
          <h2>Error</h2>
          <p>{error || 'Video no encontrado'}</p>
          <BackButton onClick={() => navigate('/')}>
            <FaArrowLeft />
            Volver al inicio
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
          Volver
        </BackButton>
      </Header>

      <VideoContainer onMouseMove={handleMouseMove}>
        <PlayerWrapper>
          <ReactPlayer
            url={streamAPI.getStreamUrl(video.filename)}
            width="100%"
            height="100%"
            playing={playing}
            volume={muted ? 0 : volume}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={(error) => {
              console.error('ReactPlayer error:', error);
              setError('Error al reproducir el video');
            }}
            controls={false}
            light={video.thumbnail ? streamAPI.getThumbnailUrl(video.thumbnail) : undefined}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                },
              },
            }}
          />
        </PlayerWrapper>

        <ControlsOverlay visible={controlsVisible}>
          <VideoInfo>
            <VideoTitle>{video.title}</VideoTitle>
            <VideoMetadata>
              <span>Subido: {new Date(video.uploadDate).toLocaleDateString('es-ES')}</span>
              <span>Tamaño: {(video.size / (1024 * 1024)).toFixed(1)} MB</span>
            </VideoMetadata>
          </VideoInfo>

          <Controls>
            <ControlButton onClick={handlePlayPause}>
              {playing ? <FaPause /> : <FaPlay />}
            </ControlButton>

            <ProgressContainer
              onClick={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
            >
              <Progress percent={played * 100} />
            </ProgressContainer>

            <TimeDisplay>
              {formatTime(duration * played)} / {formatTime(duration)}
            </TimeDisplay>

            <VolumeContainer>
              <ControlButton onClick={handleMute}>
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </ControlButton>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </VolumeContainer>
          </Controls>
        </ControlsOverlay>
      </VideoContainer>
    </Container>
  );
}

export default VideoPlayer;
