# 🎬 PoochyFlix - Netflix Clone

Una aplicación web completa para streaming de contenido multimedia desde tu PC personal, desarrollada con **TypeScript**, **React** y **Node.js**.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

## 🎯 Características Principales

- 🎥 **Streaming de video** con soporte para range requests
- 📱 **Diseño responsive** tipo Netflix
- 🎨 **Interfaz moderna** con Styled Components
- 🖼️ **Generación automática de thumbnails**
- 📤 **Subida de archivos** con drag & drop
- ⚡ **Desarrollo rápido** con TypeScript
- 🔒 **Tipado fuerte** para mejor mantenimiento

## 🚀 Características

- **Backend Node.js + TypeScript** con Express para manejo de archivos multimedia
- **Frontend React + TypeScript** con diseño tipo Netflix
- **Streaming de video** con soporte para range requests
- **Subida de archivos** con drag & drop
- **Reproductor personalizado** con controles tipo Netflix
- **Responsive design** para móviles y desktop
- **Gestión de archivos** multimedia local
- **Tipado fuerte** con TypeScript para mejor mantenimiento

## 📋 Requisitos

- Node.js (v16 o superior)
- NPM o Yarn
- Navegador web moderno

## 🛠️ Instalación

### Backend (TypeScript)

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Compila TypeScript:
```bash
npm run build
```

4. Inicia el servidor:
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### Frontend (TypeScript)

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación:
```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
netflix-clone/
├── backend/
│   ├── src/
│   │   ├── types/           # Definiciones TypeScript
│   │   ├── config/          # Configuración del servidor
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── services/        # Lógica de negocio
│   │   ├── storage/         # Sistemas de almacenamiento
│   │   ├── middleware/      # Middlewares Express
│   │   ├── routes/          # Definición de rutas
│   │   ├── data/            # Datos de ejemplo
│   │   └── server.ts        # Servidor principal
│   ├── videos/              # Archivos de video
│   ├── thumbnails/          # Miniaturas
│   ├── data/                # Base de datos JSON (opcional)
│   ├── tsconfig.json        # Configuración TypeScript
│   └── package.json         # Dependencias
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React TSX
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Cliente API TypeScript
│   │   ├── types/           # Tipos compartidos
│   │   └── App.tsx          # Componente principal
│   ├── tsconfig.json        # Configuración TypeScript
│   └── package.json         # Dependencias
└── README.md
```

## 🎬 Uso

1. **Subir Videos**: Ve a la página de subida y arrastra o selecciona archivos de video
2. **Reproducir**: Haz clic en cualquier video para abrir el reproductor
3. **Navegar**: Usa la barra de navegación para moverte entre páginas

## 💾 Opciones de Almacenamiento

El backend soporta múltiples tipos de almacenamiento:

### **Memoria (Por Defecto)**
- Rápido y simple
- Ideal para desarrollo
- Los datos se pierden al reiniciar

### **Archivo JSON**
- Persistente y portable
- Ideal para uso personal
- Configuración: `STORAGE_TYPE=json_file`

### **Base de Datos (Próximamente)**
- SQLite, MongoDB, PostgreSQL
- Escalable y robusto
- Ideal para producción

Ver [STORAGE_OPTIONS.md](backend/STORAGE_OPTIONS.md) para más detalles.

## 📱 Formatos Soportados

- **Video**: MP4, AVI, MOV, MKV, WebM
- **Tamaño máximo**: 2GB por archivo

## 🔧 API Endpoints

### Videos
- `GET /api/videos` - Obtener todos los videos
- `GET /api/videos/:id` - Obtener un video específico
- `POST /api/upload` - Subir un nuevo video
- `DELETE /api/videos/:id` - Eliminar un video

### Streaming
- `GET /videos/:filename` - Stream de video con range requests
- `GET /thumbnails/:filename` - Servir miniaturas

## 🎨 Tecnologías Utilizadas

### Backend
- **Node.js + TypeScript** - Runtime y tipado fuerte
- **Express** - Framework web
- **Multer** - Manejo de archivos multipart
- **CORS** - Cross-origin resource sharing
- **fs-extra** - Utilidades de sistema de archivos
- **ts-node-dev** - Desarrollo con hot reload

### Frontend
- **React + TypeScript** - Biblioteca de interfaz de usuario con tipado
- **React Router** - Enrutamiento
- **Styled Components** - CSS-in-JS
- **React Player** - Reproductor de video
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía

## 🚀 Características Avanzadas

- **Streaming adaptativo** con soporte para range requests
- **Interfaz responsive** que se adapta a diferentes tamaños de pantalla
- **Drag & drop** para subida de archivos
- **Controles de video personalizados** tipo Netflix
- **Gestión de estado** con React hooks
- **Manejo de errores** robusto

## 🔒 Consideraciones de Seguridad

- Validación de tipos de archivo
- Límites de tamaño de archivo
- Sanitización de nombres de archivo
- Headers de seguridad HTTP

## 📈 Próximas Mejoras

- [ ] Generación automática de miniaturas
- [ ] Sistema de autenticación
- [ ] Categorización de contenido
- [ ] Búsqueda y filtros
- [ ] Listas de reproducción
- [ ] Soporte para subtítulos
- [ ] Transcodificación de video
- [ ] Base de datos persistente

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Tu nombre - [@tuusuario](https://github.com/tuusuario)

---

¡Disfruta de tu Netflix personal! 🍿
