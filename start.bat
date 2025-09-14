@echo off
echo ========================================
echo    PoochyFlix - Iniciando Servidor
echo ========================================
echo.

echo Verificando dependencias del backend...
cd backend
if not exist "node_modules" (
    echo Instalando dependencias del backend...
    call npm install
)
cd ..

echo.
echo Verificando dependencias del frontend...
cd frontend
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call npm install
)
cd ..

echo.
echo Iniciando servidores...
echo Backend: http://localhost:5000 (TypeScript)
echo Frontend: http://localhost:3000 (TypeScript)
echo.
echo Presiona Ctrl+C para detener ambos servidores
echo.

start "Backend TypeScript" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend TypeScript" cmd /k "cd frontend && npm start"

echo Servidores iniciados!
echo.
pause
