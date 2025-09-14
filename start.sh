#!/bin/bash

echo "========================================"
echo "   PoochyFlix - Iniciando Servidor"
echo "========================================"
echo

echo "Verificando dependencias del backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias del backend..."
    npm install
fi
cd ..

echo
echo "Verificando dependencias del frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias del frontend..."
    npm install
fi
cd ..

echo
echo "Iniciando servidores..."
echo "Backend: http://localhost:5000 (TypeScript)"
echo "Frontend: http://localhost:3000 (TypeScript)"
echo
echo "Presiona Ctrl+C para detener ambos servidores"
echo

# Iniciar backend en background
cd backend && npm run dev &
BACKEND_PID=$!

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar frontend
cd ../frontend && npm start &
FRONTEND_PID=$!

echo "Servidores iniciados!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo

# Función para limpiar procesos al salir
cleanup() {
    echo "Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

# Esperar a que los procesos terminen
wait
