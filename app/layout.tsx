import type { Metadata } from 'next';
import './globals.css';

const title = 'WebP変換ツール｜PNG・JPEGを無料でWebPに変換 | machi-hub';
const description =
  'PNG・JPEG画像を無料でWebPに変換できるオンラインツール。登録不要で、画像は外部サーバーへアップロードされず、ブラウザ内で安全に変換できます。';
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'machi-hub WebP Converter',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web Browser',
      url: 'https://tool.machihub-design.com/',
      description,
      isAccessibleForFree: true,
      featureList: [
        'PNG・JPEG画像のWebP変換',
        '複数画像の一括変換',
        'ブラウザ内での画像処理',
        '横幅1920pxを超える画像の自動リサイズ',
      ],
      publisher: {
        '@type': 'Organization',
        name: '株式会社machi-hub',
        url: 'https://www.machihub-design.com/',
      },
    },
    {
      '@type': 'Organization',
      name: '株式会社machi-hub',
      url: 'https://www.machihub-design.com/',
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tool.machihub-design.com'),
  title,
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description,
    url: 'https://tool.machihub-design.com/',
    siteName: 'machi-hub tools',
    type: 'website',
    images: [{ url: '/og-image.webp', width: 1200, height: 630, alt: 'machi-hub WebP Converter' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.webp'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
