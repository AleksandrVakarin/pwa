import type { MetadataRoute } from 'next'

// Расширяем стандартный интерфейс Manifest для добавления полей Яндекса
interface ExtendedManifest extends MetadataRoute.Manifest {
  yandex?: {
    pwa_version: string;
    ui_theme: 'light' | 'dark' | 'system';
  };
}

export default function manifest(): ExtendedManifest {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    // Добавляем специфичные поля для Яндекса
    yandex: {
      pwa_version: '1.0',
      ui_theme: 'dark',
    },
  }
}