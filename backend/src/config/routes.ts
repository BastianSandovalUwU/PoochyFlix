// Configuración de rutas predefinidas
export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requiresAuth?: boolean;
  rateLimit?: number;
}

export const predefinedRoutes: RouteConfig[] = [
  // Rutas de API
  {
    path: '/api/videos',
    method: 'GET',
    description: 'Obtener todos los videos disponibles'
  },
  {
    path: '/api/videos/:id',
    method: 'GET',
    description: 'Obtener un video específico por ID'
  },
  {
    path: '/api/videos/upload',
    method: 'POST',
    description: 'Subir un nuevo video',
    rateLimit: 5 // 5 uploads por minuto
  },
  {
    path: '/api/videos/:id',
    method: 'DELETE',
    description: 'Eliminar un video'
  },
  
  // Rutas de streaming
  {
    path: '/videos/:filename',
    method: 'GET',
    description: 'Stream de video con range requests'
  },
  {
    path: '/thumbnails/:filename',
    method: 'GET',
    description: 'Servir miniaturas de videos'
  },
  
  // Rutas de utilidad
  {
    path: '/api/test',
    method: 'GET',
    description: 'Verificar estado del servidor'
  },
  {
    path: '/api/stats',
    method: 'GET',
    description: 'Estadísticas del servidor'
  }
];

export const getRouteInfo = (path: string, method: string): RouteConfig | undefined => {
  return predefinedRoutes.find(route => 
    route.path === path && route.method === method
  );
};
