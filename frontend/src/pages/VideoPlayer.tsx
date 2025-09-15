import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';
import { videoAPI, streamAPI } from '../services/api';
import { Video } from '../types';


const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playerRef = useRef<ReactPlayer>(null);
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
    
    // Si el reproductor está disponible, hacer seek inmediatamente
    if (playerRef.current) {
      playerRef.current.seekTo(pos);
    }
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

  const handleScreenClick = (): void => {
    setPlaying(!playing);
  };

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex justify-center items-center h-screen text-white text-lg">
          Cargando video...
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex flex-col justify-center items-center h-screen text-netflix-red text-lg text-center p-5">
          <h2>Error</h2>
          <p>{error || 'Video no encontrado'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-transparent border-none text-white cursor-pointer p-2 flex items-center gap-2 text-base hover:text-netflix-light-gray transition-colors duration-300"
          >
            <FaArrowLeft />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/70 to-transparent flex items-center px-[4%] z-50">
        <button 
          onClick={() => navigate('/')}
          className="bg-transparent border-none text-white cursor-pointer p-2 flex items-center gap-2 text-base hover:text-netflix-light-gray transition-colors duration-300"
        >
          <FaArrowLeft />
          Volver
        </button>
      </div>

      <div className="w-full h-screen relative bg-black" onMouseMove={handleMouseMove} onClick={handleScreenClick}>
        <div className="relative w-full h-full">
          <ReactPlayer
            ref={playerRef}
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
          
          {/* Icono de pausa en el centro de la pantalla */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="bg-black/50 rounded-full p-6 backdrop-blur-sm cursor-pointer hover:bg-black/60 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaying(true);
                }}
              >
                <FaPlay className="text-white text-6xl opacity-80" />
              </div>
            </div>
          )}
        </div>

        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-10 px-[4%] z-40 transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5">
            <h1 className="text-white text-3xl md:text-2xl font-bold mb-2.5">
              {video.title}
            </h1>
            <div className="text-netflix-light-gray text-base flex gap-5 flex-wrap">
              <span>Subido: {new Date(video.uploadDate).toLocaleDateString('es-ES')}</span>
              <span>Tamaño: {(video.size / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={handlePlayPause}
              className="bg-white/20 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-300 text-white"
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>

            <div
              className="flex-1 h-1.5 bg-white/30 rounded cursor-pointer relative"
              onClick={(e) => {
                e.stopPropagation();
                handleSeekChange(e);
              }}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onMouseMove={(e) => {
                if (seeking) {
                  handleSeekChange(e);
                }
              }}
            >
              <div 
                className="h-full bg-netflix-red rounded transition-all duration-100"
                style={{ width: `${played * 100}%` }}
              />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-netflix-red rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${played * 100}%`, marginLeft: '-8px' }}
              />
            </div>

            <div className="text-white text-sm min-w-20 text-center">
              {formatTime(duration * played)} / {formatTime(duration)}
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMute();
                }}
                className="bg-white/20 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-300 text-white"
              >
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <div className="relative w-20 h-1 bg-white/30 rounded cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <div 
                  className="h-full bg-netflix-red rounded transition-all duration-100"
                  style={{ width: `${(muted ? 0 : volume) * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="bg-white/20 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-300 text-white"
                title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
