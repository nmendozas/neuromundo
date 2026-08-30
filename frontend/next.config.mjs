/** @type {import('next').NextConfig} */
const nextConfig = {
  // Obligatorio para generar la salida standalone y optimizar la imagen Docker
  output: 'standalone',
  reactStrictMode: true,
};

export default nextConfig;
