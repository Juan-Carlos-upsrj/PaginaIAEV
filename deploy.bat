@echo off
echo Desplegando a GitHub Pages...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo Error al construir el proyecto.
    pause
    exit /b %errorlevel%
)

cd dist
git init
git checkout -b gh-pages
git add -A
git commit -m "deploy"
git push -f https://github.com/Juan-Carlos-upsrj/PaginaIAEV.git gh-pages

echo.
echo Despliegue completado!
pause
