import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUpload, FaFileVideo, FaTimes, FaCheck } from 'react-icons/fa';
import { videoAPI } from '../services/api';
import { AlertState } from '../types';

const Container = styled.div`
  padding: 100px 4% 40px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

interface UploadCardProps {
  dragActive: boolean;
}

const UploadCard = styled.div<UploadCardProps>`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 40px;
  border: 2px dashed ${props => props.dragActive ? '#e50914' : '#333'};
  transition: border-color 0.3s ease;
  text-align: center;
`;

const UploadArea = styled.div`
  cursor: pointer;
  padding: 40px 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(229, 9, 20, 0.1);
  }
`;

interface UploadIconProps {
  dragActive: boolean;
}

const UploadIcon = styled.div<UploadIconProps>`
  font-size: 4rem;
  color: ${props => props.dragActive ? '#e50914' : '#666'};
  margin-bottom: 20px;
  transition: color 0.3s ease;
`;

const UploadText = styled.p`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const UploadSubtext = styled.p`
  color: #b3b3b3;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const FileInput = styled.input`
  display: none;
`;

const BrowseButton = styled.button`
  background: #e50914;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f40612;
  }
`;

const Form = styled.form`
  margin-top: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  color: #ffffff;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e50914;
  }

  &::placeholder {
    color: #b3b3b3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  &.primary {
    background: #e50914;
    color: #ffffff;
    border: none;

    &:hover:not(:disabled) {
      background: #f40612;
    }

    &:disabled {
      background: #666;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: transparent;
    color: #ffffff;
    border: 1px solid #555;

    &:hover {
      background: #333;
      border-color: #777;
    }
  }
`;

const ProgressContainer = styled.div`
  margin-top: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
`;

interface ProgressProps {
  percent: number;
}

const Progress = styled.div<ProgressProps>`
  height: 100%;
  background: #e50914;
  width: ${props => props.percent}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  color: #b3b3b3;
  font-size: 14px;
  text-align: center;
`;

const FileInfo = styled.div`
  background: #333;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileIcon = styled.div`
  color: #e50914;
  font-size: 24px;
`;

const FileName = styled.span`
  color: #ffffff;
  font-weight: 500;
`;

const FileSize = styled.span`
  color: #b3b3b3;
  font-size: 14px;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;

  &:hover {
    color: #e50914;
  }
`;

const Alert = styled.div`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;

  &.success {
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    color: #00ff00;
  }

  &.error {
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: #ff0000;
  }
`;

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File): void => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    
    if (!allowedTypes.includes(file.type)) {
      setAlert({
        type: 'error',
        message: 'Tipo de archivo no soportado. Solo se permiten archivos de video.'
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
      setAlert({
        type: 'error',
        message: 'El archivo es demasiado grande. El tamaño máximo es 2GB.'
      });
      return;
    }

    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    setAlert(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = (): void => {
    setSelectedFile(null);
    setTitle('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!selectedFile || !title.trim()) {
      setAlert({
        type: 'error',
        message: 'Por favor selecciona un archivo y proporciona un título.'
      });
      return;
    }

    setUploading(true);
    setAlert(null);

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('title', title.trim());

    try {
      await videoAPI.uploadVideo(
        formData,
        (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      );

      setAlert({
        type: 'success',
        message: 'Video subido exitosamente!'
      });

      // Limpiar formulario
      removeFile();
      
      // Redirigir después de un momento
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error uploading video:', error);
      setAlert({
        type: 'error',
        message: 'Error al subir el video. Inténtalo de nuevo.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container>
      <Title>Subir Video</Title>

      {alert && (
        <Alert className={alert.type}>
          {alert.type === 'success' ? <FaCheck /> : <FaTimes />}
          {alert.message}
        </Alert>
      )}

      <UploadCard
        dragActive={dragActive}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <UploadArea onClick={() => fileInputRef.current?.click()}>
            <UploadIcon dragActive={dragActive}>
              <FaUpload />
            </UploadIcon>
            <UploadText>
              {dragActive ? 'Suelta el archivo aquí' : 'Arrastra tu video aquí'}
            </UploadText>
            <UploadSubtext>
              o haz clic para seleccionar un archivo
            </UploadSubtext>
            <BrowseButton>
              <FaFileVideo />
              Seleccionar Archivo
            </BrowseButton>
            <UploadSubtext style={{ marginTop: '20px' }}>
              Formatos soportados: MP4, AVI, MOV, MKV, WebM (máx. 2GB)
            </UploadSubtext>
          </UploadArea>
        ) : (
          <FileInfo>
            <FileDetails>
              <FileIcon>
                <FaFileVideo />
              </FileIcon>
              <div>
                <FileName>{selectedFile.name}</FileName>
                <br />
                <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
              </div>
            </FileDetails>
            <RemoveButton onClick={removeFile}>
              <FaTimes />
            </RemoveButton>
          </FileInfo>
        )}

        <FileInput
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleInputChange}
        />
      </UploadCard>

      {selectedFile && (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Título del Video</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa un título para tu video"
              required
            />
          </FormGroup>

          {uploading && (
            <ProgressContainer>
              <ProgressBar>
                <Progress percent={uploadProgress} />
              </ProgressBar>
              <ProgressText>
                Subiendo... {uploadProgress}%
              </ProgressText>
            </ProgressContainer>
          )}

          <ButtonGroup>
            <Button
              type="button"
              className="secondary"
              onClick={() => navigate('/')}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="primary"
              disabled={uploading || !title.trim()}
            >
              {uploading ? 'Subiendo...' : 'Subir Video'}
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Container>
  );
}

export default Upload;
