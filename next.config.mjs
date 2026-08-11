/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.google.com' },
      { protocol: 'https', hostname: '*.seneweb.com' },
      { protocol: 'https', hostname: '*.dakaractu.com' },
      { protocol: 'https', hostname: '*.aps.sn' },
      { protocol: 'https', hostname: '*.pressafrik.com' },
      { protocol: 'https', hostname: '*.lesoleil.sn' },
      { protocol: 'https', hostname: '*.senego.com' },
      { protocol: 'https', hostname: '*.leral.net' },
      { protocol: 'https', hostname: '*.wiwsport.com' },
      { protocol: 'https', hostname: '*.senegal7.com' },
      { protocol: 'https', hostname: '*.walf-groupe.com' },
      { protocol: 'https', hostname: '*.kewoulo.info' }
    ]
  }
};

export default nextConfig;
