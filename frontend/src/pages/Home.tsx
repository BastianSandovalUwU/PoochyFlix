import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaImage } from 'react-icons/fa';
import VideoCard from '../components/VideoCard';
import { videoAPI } from '../services/api';
import { Video } from '../types';

const Container = styled.div`
  padding-top: 80px;
  min-height: 100vh;
`;

const Hero = styled.section`
  position: relative;
  height: 70vh;
  background: linear-gradient(45deg, #141414, #333);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroContent = styled.div`
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #e50914, #f40612);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: #b3b3b3;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled.button`
  background: #e50914;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f40612;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ThumbnailButton = styled.button`
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #444;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
`;

const Content = styled.section`
  padding: 40px 4%;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #b3b3b3;
  font-size: 18px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #e50914;
  font-size: 18px;
  text-align: center;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #b3b3b3;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  color: #ffffff;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
`;

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
      return <LoadingContainer>Cargando videos...</LoadingContainer>;
    }

    if (error) {
      return (
        <ErrorContainer>
          <div>
            <p>{error}</p>
            <CTAButton onClick={fetchVideos} style={{ marginTop: '20px' }}>
              Reintentar
            </CTAButton>
          </div>
        </ErrorContainer>
      );
    }

    if (videos.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon>🎬</EmptyIcon>
          <EmptyTitle>No hay videos disponibles</EmptyTitle>
          <EmptyText>
            Sube tu primer video para comenzar a disfrutar del streaming
          </EmptyText>
          <CTAButton onClick={() => window.location.href = '/upload'}>
            Subir Video
          </CTAButton>
        </EmptyState>
      );
    }

    return (
      <>
        <HeaderActions>
          <ThumbnailButton 
            onClick={generateAllThumbnails}
            disabled={generatingThumbnails}
          >
            <FaImage />
            {generatingThumbnails ? 'Generando...' : 'Generar Thumbnails'}
          </ThumbnailButton>
        </HeaderActions>
        <VideoGrid>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </VideoGrid>
      </>
    );
  };

  return (
    <Container>
      <Hero>
        <HeroContent>
          <HeroTitle>PoochyFlix</HeroTitle>
          <HeroSubtitle>
            Disfruta de tu contenido multimedia personalizado
          </HeroSubtitle>
          <CTAButton onClick={() => window.location.href = '/upload'}>
            Subir Contenido
          </CTAButton>
        </HeroContent>
      </Hero>

      <Content>
        <Section>
          <SectionTitle>Mis Videos</SectionTitle>
          {renderVideos()}
        </Section>

        {videos.length > 0 && (
          <Section>
            <SectionTitle>Recientes</SectionTitle>
            <VideoGrid>
              {videos
                .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                .slice(0, 6)
                .map((video) => (
                  <VideoCard key={`recent-${video.id}`} video={video} />
                ))}
            </VideoGrid>
          </Section>
        )}
      </Content>
    </Container>
  );
}

export default Home;
