import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileVideo, FaTimes, FaCheck } from 'react-icons/fa';
import { videoAPI } from '../services/api';
import { AlertState } from '../types';


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
    <div className="pt-24 px-[4%] pb-10 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-white text-4xl md:text-3xl font-bold mb-10 text-center">
        Subir Video
      </h1>

      {alert && (
        <div className={`p-4 rounded-lg mb-5 flex items-center gap-3 ${
          alert.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {alert.type === 'success' ? <FaCheck /> : <FaTimes />}
          {alert.message}
        </div>
      )}

      <div
        className={`bg-gray-800 rounded-xl p-10 border-2 border-dashed text-center transition-colors duration-300 ${
          dragActive ? 'border-netflix-red' : 'border-netflix-gray'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer p-10 hover:bg-netflix-red/10 transition-colors duration-300"
          >
            <div className={`text-6xl mb-5 transition-colors duration-300 ${
              dragActive ? 'text-netflix-red' : 'text-gray-500'
            }`}>
              <FaUpload />
            </div>
            <p className="text-white text-xl mb-2.5">
              {dragActive ? 'Suelta el archivo aquí' : 'Arrastra tu video aquí'}
            </p>
            <p className="text-netflix-light-gray text-sm mb-5">
              o haz clic para seleccionar un archivo
            </p>
            <button className="bg-netflix-red hover:bg-netflix-red-hover text-white border-none rounded-md px-6 py-3 text-base font-semibold cursor-pointer transition-colors duration-300 inline-flex items-center gap-2">
              <FaFileVideo />
              Seleccionar Archivo
            </button>
            <p className="text-netflix-light-gray text-sm mt-5">
              Formatos soportados: MP4, AVI, MOV, MKV, WebM (máx. 2GB)
            </p>
          </div>
        ) : (
          <div className="bg-netflix-gray rounded-lg p-5 mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-netflix-red text-2xl">
                <FaFileVideo />
              </div>
              <div>
                <span className="text-white font-medium">{selectedFile.name}</span>
                <br />
                <span className="text-netflix-light-gray text-sm">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="bg-transparent border-none text-netflix-light-gray cursor-pointer p-1 rounded hover:text-netflix-red transition-colors duration-300"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="mb-6">
            <label htmlFor="title" className="block text-white text-base font-medium mb-2">
              Título del Video
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa un título para tu video"
              required
              className="w-full bg-netflix-gray border border-gray-600 rounded-md text-white px-4 py-3 text-base transition-colors duration-300 focus:outline-none focus:border-netflix-red placeholder:text-netflix-light-gray"
            />
          </div>

          {uploading && (
            <div className="mt-5">
              <div className="w-full h-2 bg-netflix-gray rounded-md overflow-hidden mb-2.5">
                <div 
                  className="h-full bg-netflix-red transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-netflix-light-gray text-sm text-center">
                Subiendo... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center mt-10 md:flex-col">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={uploading}
              className="px-8 py-3 rounded-md text-base font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 min-w-32 justify-center bg-transparent text-white border border-gray-600 hover:bg-netflix-gray hover:border-gray-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading || !title.trim()}
              className="px-8 py-3 rounded-md text-base font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 min-w-32 justify-center bg-netflix-red text-white border-none hover:bg-netflix-red-hover disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {uploading ? 'Subiendo...' : 'Subir Video'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Upload;
