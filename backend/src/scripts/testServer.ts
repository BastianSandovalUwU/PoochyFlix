#!/usr/bin/env ts-node

import { videoService } from '../services/videoService';

// Script para probar el servidor
async function testServer() {
  console.log('🧪 Probando el servidor...');

  try {
    // Inicializar el servicio
    await videoService.initialize();
    console.log('✅ Servicio de videos inicializado correctamente');

    // Probar obtener videos
    const videos = videoService.getAllVideos();
    console.log(`✅ Videos obtenidos: ${videos.length}`);

    // Probar contar videos
    const count = videoService.getVideoCount();
    console.log(`✅ Conteo de videos: ${count}`);

    console.log('🎉 ¡Servidor funcionando correctamente!');
  } catch (error) {
    console.error('❌ Error probando el servidor:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testServer().catch(console.error);
}

export { testServer };
