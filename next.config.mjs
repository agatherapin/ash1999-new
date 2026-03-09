/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        formats: ['image/avif', 'image/webp'],
    },
    experimental: {
        optimizeCss: true,
    },
};

export default nextConfig;