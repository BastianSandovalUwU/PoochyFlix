#!/usr/bin/env ts-node

import fs from 'fs-extra';
import path from 'path';
import { JsonFileStorage } from '../storage/jsonFileStorage';
import { MemoryStorage } from '../storage/memoryStorage';

// Script para inicializar datos de ejemplo
async function initializeSampleData() {
  console.log('🚀 Inicializando datos de ejemplo...');

  // Crear directorios necesarios
  await fs.ensureDir('./videos');
  await fs.ensureDir('./thumbnails');
  await fs.ensureDir('./data');

  // Cargar datos de ejemplo
  const sampleDataPath = path.join(__dirname, '../data/sampleVideos.json');
  
  if (await fs.pathExists(sampleDataPath)) {
    const sampleData = await fs.readJson(sampleDataPath);
    
    // Usar JSON storage para persistir los datos
    const storage = new JsonFileStorage('./data/videos.json');
    await storage.initialize();
    
    // Agregar videos de ejemplo si no existen
    for (const video of sampleData.videos) {
      try {
        await storage.addVideo(video);
        console.log(`✅ Video agregado: ${video.title}`);
      } catch (error) {
        console.log(`⚠️  Video ya existe: ${video.title}`);
      }
    }
    
    console.log('✅ Datos de ejemplo inicializados correctamente');
  } else {
    console.log('⚠️  Archivo de datos de ejemplo no encontrado');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeSampleData().catch(console.error);
}

export { initializeSampleData };
