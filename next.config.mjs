/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // For easier GSAP development sometimes, though keeping true is better practice, we disable for React 18 strict mode double-firing behaviors with GSAP.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
