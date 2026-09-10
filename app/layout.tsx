import type { Metadata } from 'next';
import './globals.css';

const title = 'WebP変換ツール｜PNG・JPEGを無料でWebPに変換 | machi-hub';
const description =
  'PNG・JPEG画像を無料でWebPに変換できるオンラインツール。登録不要で、画像は外部サーバーへアップロードされず、ブラウザ内で安全に変換できます。';

export const metadata: Metadata = {
  metadataBase: new URL('https://tools.machi-hub.jp'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://tools.machi-hub.jp/webp/',
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
      <body>{children}</body>
    </html>
  );
}
