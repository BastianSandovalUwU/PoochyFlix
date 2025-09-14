export interface Video {
  id: number;
  title: string;
  filename: string;
  size: number;
  duration: number;
  thumbnail: string | null;
  uploadDate: string;
  path: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
}

export interface VideoMetadata {
  duration?: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface PlayerState {
  playing: boolean;
  volume: number;
  muted: boolean;
  duration: number;
  played: number;
  seeking: boolean;
}

export interface ServerStatus {
  message: string;
  videosCount: number;
  timestamp: string;
  config: {
    videosDir: string;
    thumbnailsDir: string;
    maxFileSize: number;
    allowedMimeTypes: string[];
  };
}

export interface UploadFormData {
  title: string;
  video: File;
}

export interface AlertState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
}

export interface VideoCardProps {
  video: Video;
  onPlay?: (video: Video) => void;
  onInfo?: (video: Video) => void;
}

export interface VideoPlayerProps {
  videoId: string;
}

export interface UploadProps {
  onUploadSuccess?: (video: Video) => void;
}

export interface NavbarProps {
  onSearch?: (query: string) => void;
}

export interface HomeProps {
  onVideoSelect?: (video: Video) => void;
}
