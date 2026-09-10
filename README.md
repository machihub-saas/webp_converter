# machi-hub WebP Converter

PNG・JPG・JPEG画像をブラウザ内だけでWebPへ変換する静的Webアプリです。画像、ファイル名、変換結果はサーバーへ送信・保存しません。

## ローカル開発

```bash
npm install
npm run dev
```

## Cloudflare Pages

GitHubリポジトリをCloudflare Pagesへ接続し、次の設定でデプロイできます。

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist/client`
- Node.js version: `22.13.0` 以上

このアプリは静的出力のみを使用します。Workers、R2、D1、KV、サーバーAPIは不要です。

## 主な仕様

- PNG / JPG / JPEG、複数画像、ドラッグ＆ドロップに対応
- 画質は10〜100%（初期値80%）
- 個別WebPダウンロード、複数画像のZIP一括ダウンロード
- Canvas APIによる完全なクライアントサイド変換
- レスポンシブUI、SEO / OGPメタデータ

## コマンド

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```
