# CIMA Watch: Buscador de Desabastecimientos

Aplicación web moderna para visualizar medicamentos en situación de desabastecimiento en España, utilizando la API oficial de la AEMPS (CIMA).

## Características

- 🔍 **Buscador en tiempo real**: Filtra por nombre o Códige Nacional (CN).
- 🏥 **Integración con Catálogo Hospitalario**: Sube tu inventario (Excel/CSV) para identificar fármacos afectados en tu centro.
- 🚦 **Alertas Prioritarias**: Identifica automáticamente desabastecimientos críticos sin alternativa terapéutica.
- 📱 **Diseño Responsive**: Interfaz limpia, optimizada y accesible.

## Instalación y Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Construir para producción:
   ```bash
   npm run build
   ```

## Despliegue (Cómo subirlo a internet)

### Opción Recomendada: Vercel (Gratis)

Esta aplicación utiliza un **proxy** para conectar con la API de CIMA y evitar errores de conexión (CORS). **Vercel** soporta este proxy de forma nativa.

1. Sube este código a un repositorio de **GitHub**.
2. Crea una cuenta en [Vercel](https://vercel.com).
3. Importar el proyecto desde GitHub.
4. Vercel detectará que es un proyecto Vite y lo desplegará automáticamente.
5. **Importante**: Asegúrate de que el archivo `vercel.json` (incluido) esté en la raíz para que funcione la API.

### GitHub Pages

GitHub Pages es un alojamiento estático y **no soporta el proxy API** necesario para que esta app funcione correctamente (los datos no cargarían). Se recomienda usar Vercel o Netlify.

## Tecnologías

- React + Vite
- CSS Modules (Diseño Premium)
- Lucide React (Iconos)
- SheetJS (Procesamiento Excel)
- CIMA REST API
