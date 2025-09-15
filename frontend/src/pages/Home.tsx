import React, { useState, useEffect } from 'react';
import { FaImage } from 'react-icons/fa';
import VideoCard from '../components/VideoCard';
import { videoAPI } from '../services/api';
import { Video } from '../types';


const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingThumbnails, setGeneratingThumbnails] = useState<boolean>(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await videoAPI.getVideos();
      setVideos(response.data.data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Error al cargar los videos. Asegúrate de que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const generateAllThumbnails = async (): Promise<void> => {
    try {
      setGeneratingThumbnails(true);
      await videoAPI.generateAllThumbnails();
      
      // Recargar videos para mostrar los nuevos thumbnails
      await fetchVideos();
      
      alert('Thumbnails generados exitosamente para todos los videos');
    } catch (error) {
      console.error('Error generando thumbnails:', error);
      alert('Error generando thumbnails. Inténtalo de nuevo.');
    } finally {
      setGeneratingThumbnails(false);
    }
  };

  const renderVideos = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48 text-netflix-light-gray text-lg">
          Cargando videos...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-48 text-netflix-red text-lg text-center p-5">
          <div>
            <p>{error}</p>
            <button 
              onClick={fetchVideos} 
              className="mt-5 bg-netflix-red hover:bg-netflix-red-hover text-white border-none rounded px-6 py-3 text-base font-semibold cursor-pointer transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    if (videos.length === 0) {
      return (
        <div className="text-center py-15 px-5 text-netflix-light-gray">
          <div className="text-6xl mb-5">🎬</div>
          <h3 className="text-2xl mb-2.5 text-white">No hay videos disponibles</h3>
          <p className="text-base mb-7.5">
            Sube tu primer video para comenzar a disfrutar del streaming
          </p>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="bg-netflix-red hover:bg-netflix-red-hover text-white border-none rounded px-6 py-3 text-base font-semibold cursor-pointer transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Subir Video
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="flex gap-4 items-center mb-5">
          <button 
            onClick={generateAllThumbnails}
            disabled={generatingThumbnails}
            className="bg-netflix-gray hover:bg-gray-600 text-white border border-gray-600 px-4 py-2 text-sm rounded cursor-pointer flex items-center gap-2 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <FaImage />
            {generatingThumbnails ? 'Generando...' : 'Generar Thumbnails'}
          </button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative h-[70vh] bg-gradient-to-br from-netflix-dark to-netflix-gray flex items-center justify-center overflow-hidden">
        <div className="text-center z-10 max-w-4xl px-5">
          <h1 className="text-6xl md:text-4xl font-black mb-5 bg-gradient-to-r from-netflix-red to-netflix-red-hover bg-clip-text text-transparent">
            PoochyFlix
          </h1>
          <p className="text-2xl md:text-xl text-netflix-light-gray mb-7.5">
            Disfruta de tu contenido multimedia personalizado
          </p>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="bg-netflix-red hover:bg-netflix-red-hover text-white border-none rounded px-6 py-3 text-base font-semibold cursor-pointer transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Subir Contenido
          </button>
        </div>
      </section>

      <section className="py-10 px-[4%]">
        <div className="mb-10">
          <h2 className="text-white text-2xl font-semibold mb-5">Mis Videos</h2>
          {renderVideos()}
        </div>

        {videos.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white text-2xl font-semibold mb-5">Recientes</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:gap-4">
              {videos
                .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                .slice(0, 6)
                .map((video) => (
                  <VideoCard key={`recent-${video.id}`} video={video} />
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
