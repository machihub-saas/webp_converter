'use client';

import { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  FileImage,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Trash2,
  X,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type ConversionStatus = 'converting' | 'done' | 'error';

type ConversionItem = {
  id: string;
  file: File;
  previewUrl: string;
  width?: number;
  height?: number;
  webp?: Blob;
  status: ConversionStatus;
  error?: string;
};

type BrowserModelContext = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => Promise<Record<string, unknown>>;
    },
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

declare global {
  interface Document {
    modelContext?: BrowserModelContext;
  }
}

const acceptedTypes = new Set(['image/png', 'image/jpeg']);

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function getReduction(original: number, converted?: number) {
  if (!converted || original === 0) return 0;
  return Math.max(0, Math.round((1 - converted / original) * 100));
}

function webpName(name: string) {
  return `${name.replace(/\.(png|jpe?g)$/i, '')}.webp`;
}

async function convertToWebp(file: File, quality: number) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) {
    bitmap.close();
    throw new Error('画像を読み込めませんでした。');
  }

  context.drawImage(bitmap, 0, 0);
  const width = bitmap.width;
  const height = bitmap.height;
  bitmap.close();

  const webp = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('このブラウザではWebPに変換できません。')),
      'image/webp',
      quality / 100,
    );
  });

  return { webp, width, height };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Home() {
  const [quality, setQuality] = useState(80);
  const [items, setItems] = useState<ConversionItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState('');
  const [zipping, setZipping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ConversionItem[]>([]);
  const qualityRef = useRef(quality);
  const qualityReady = useRef(false);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: 'configure_webp_quality',
          title: 'WebP画質を設定',
          description:
            '画面上のWebP変換画質を10〜100%の範囲で設定します。画像データの選択や送信は行いません。',
          inputSchema: {
            type: 'object',
            properties: {
              quality: {
                type: 'integer',
                minimum: 10,
                maximum: 100,
                description: '設定するWebP画質（パーセント）',
              },
            },
            required: ['quality'],
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: false,
            untrustedContentHint: false,
          },
          async execute(input) {
            const qualityValue =
              typeof input === 'object' && input !== null
                ? (input as { quality?: unknown }).quality
                : undefined;
            if (
              typeof qualityValue !== 'number' ||
              !Number.isInteger(qualityValue) ||
              qualityValue < 10 ||
              qualityValue > 100
            ) {
              throw new Error('qualityには10〜100の整数を指定してください。');
            }
            setQuality(qualityValue);
            return { quality: qualityValue, status: 'configured' };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);

    return () => lifecycle.abort();
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    qualityRef.current = quality;
    if (!qualityReady.current) {
      qualityReady.current = true;
      return;
    }

    const timer = window.setTimeout(async () => {
      const current = itemsRef.current;
      if (!current.length) return;

      setItems((previous) =>
        previous.map((item) => ({
          ...item,
          status: 'converting',
          error: undefined,
        })),
      );

      const results = await Promise.all(
        current.map(async (item) => {
          try {
            const converted = await convertToWebp(item.file, quality);
            return { id: item.id, ...converted };
          } catch (error) {
            return {
              id: item.id,
              error:
                error instanceof Error
                  ? error.message
                  : '変換中にエラーが発生しました。',
            };
          }
        }),
      );

      if (qualityRef.current !== quality) return;
      setItems((previous) =>
        previous.map((item) => {
          const result = results.find((candidate) => candidate.id === item.id);
          if (!result) return item;
          if ('error' in result) {
            return { ...item, status: 'error', error: result.error };
          }
          return { ...item, ...result, status: 'done', error: undefined };
        }),
      );
    }, 260);

    return () => window.clearTimeout(timer);
  }, [quality]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  async function addFiles(fileList: FileList | File[]) {
    const selected = Array.from(fileList);
    const valid = selected.filter((file) => acceptedTypes.has(file.type));
    const rejectedCount = selected.length - valid.length;

    setMessage(
      rejectedCount ? 'PNG・JPG・JPEG形式の画像を選択してください。' : '',
    );
    if (!valid.length) return;

    const additions: ConversionItem[] = valid.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'converting',
    }));
    setItems((previous) => [...previous, ...additions]);

    const requestedQuality = qualityRef.current;
    const results = await Promise.all(
      additions.map(async (item) => {
        try {
          const converted = await convertToWebp(item.file, requestedQuality);
          return { id: item.id, ...converted };
        } catch (error) {
          return {
            id: item.id,
            error:
              error instanceof Error
                ? error.message
                : '変換中にエラーが発生しました。',
          };
        }
      }),
    );

    if (qualityRef.current !== requestedQuality) return;
    setItems((previous) =>
      previous.map((item) => {
        const result = results.find((candidate) => candidate.id === item.id);
        if (!result) return item;
        if ('error' in result) {
          return { ...item, status: 'error', error: result.error };
        }
        return { ...item, ...result, status: 'done', error: undefined };
      }),
    );
  }

  function removeItem(id: string) {
    setItems((previous) => {
      const target = previous.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return previous.filter((item) => item.id !== id);
    });
  }

  function clearItems() {
    itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setMessage('');
    if (inputRef.current) inputRef.current.value = '';
  }

  async function downloadAll() {
    const readyItems = items.filter((item) => item.status === 'done' && item.webp);
    if (!readyItems.length) return;
    if (readyItems.length === 1) {
      triggerDownload(readyItems[0].webp!, webpName(readyItems[0].file.name));
      return;
    }

    setZipping(true);
    try {
      const zip = new JSZip();
      const usedNames = new Map<string, number>();
      readyItems.forEach((item) => {
        const baseName = webpName(item.file.name);
        const seen = usedNames.get(baseName) ?? 0;
        usedNames.set(baseName, seen + 1);
        const uniqueName = seen
          ? baseName.replace(/\.webp$/i, `-${seen + 1}.webp`)
          : baseName;
        zip.file(uniqueName, item.webp!);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, 'webp-images.zip');
    } finally {
      setZipping(false);
    }
  }

  const completed = items.filter((item) => item.status === 'done' && item.webp);
  const originalTotal = completed.reduce((sum, item) => sum + item.file.size, 0);
  const convertedTotal = completed.reduce(
    (sum, item) => sum + (item.webp?.size ?? 0),
    0,
  );
  const allComplete = items.length > 0 && completed.length === items.length;

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-white/12 bg-[#10233f] text-white">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <a className="group flex shrink-0 items-center gap-3 whitespace-nowrap" href="#top" aria-label="machi-hub tools トップ">
            <span className="grid size-8 place-items-center rounded-full bg-[#c8f45f] text-[11px] font-black tracking-[-0.08em] text-[#10233f] transition-transform group-hover:rotate-6">mh</span>
            <span className="hidden text-sm font-bold tracking-[0.08em] min-[370px]:inline">machi-hub tools</span>
          </a>
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xs font-semibold text-white/70">
            <span className="hidden sm:inline">TOOL</span>
            <span className="text-[#c8f45f]">#001</span>
            <span className="h-3 w-px bg-white/25" />
            <span>WebP Converter</span>
          </div>
        </div>
      </header>

      <section id="top" className="relative border-b border-[#10233f]/10">
        <div className="pointer-events-none absolute inset-0 grid-paper opacity-55" />
        <div className="relative mx-auto grid max-w-[1240px] gap-9 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-14 lg:py-16">
          <div className="lg:sticky lg:top-8 lg:pt-5">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#10233f]/15 bg-white px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-[#224d36]">
              <ShieldCheck className="size-4" aria-hidden="true" />無料・登録不要
            </p>
            <h1 className="text-[clamp(2.65rem,11vw,5.25rem)] font-black leading-[0.96] tracking-[-0.075em] text-[#10233f] lg:text-[clamp(3.25rem,5.2vw,4.1rem)]">
              <span className="phrase whitespace-nowrap">PNG・JPEGを</span>
              <br />
              <span className="phrase whitespace-nowrap">
                <span className="relative inline-block text-[#155eef]">
                  WebP<span className="absolute -bottom-1 left-0 -z-10 h-2 w-full -rotate-1 bg-[#c8f45f]" />
                </span>に
              </span>
              <span className="phrase whitespace-nowrap">変換。</span>
            </h1>
            <p className="mt-7 max-w-[34rem] text-pretty text-base leading-8 text-[#42526a] sm:text-lg">
              <span className="phrase">画像を選んだら、</span>
              <span className="phrase">あとはダウンロードするだけ。</span>
              <span className="phrase">処理はすべて、</span>
              <span className="phrase">このブラウザの中で完了します。</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#42526a]">
              <span className="flex items-center gap-2"><Check className="size-4 text-[#16834d]" />複数画像OK</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-[#16834d]" />サーバー送信なし</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-[#16834d]" />すぐに保存</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-[28px] bg-[#10233f] sm:-bottom-4 sm:-right-4" />
            <div className="relative rounded-[26px] border-2 border-[#10233f] bg-white p-4 sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black tracking-[0.18em] text-[#155eef]">01 / CONVERT</p>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.035em] text-[#10233f]">画像をWebPにする</h2>
                </div>
                {items.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearItems} className="text-[#526174]">
                    <RotateCcw aria-hidden="true" />リセット
                  </Button>
                )}
              </div>

              <input
                ref={inputRef}
                id="file-input"
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                multiple
                onChange={(event) => {
                  if (event.target.files) void addFiles(event.target.files);
                  event.target.value = '';
                }}
              />
              <button
                type="button"
                className={`drop-zone ${dragging ? 'is-dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }}
                onDrop={(event) => { event.preventDefault(); setDragging(false); void addFiles(event.dataTransfer.files); }}
                aria-label="PNG・JPEG画像を選択"
              >
                <div className="grid size-14 place-items-center rounded-2xl bg-[#eaf0ff] text-[#155eef] sm:size-16">
                  <ImagePlus className="size-7 sm:size-8" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-black tracking-[-0.025em] text-[#10233f] sm:text-xl">
                    <span className="hidden sm:inline">ここに画像をドロップ</span>
                    <span className="sm:hidden">画像を選択</span>
                  </p>
                  <p className="mt-1 flex flex-wrap justify-center gap-x-1 text-sm text-[#66758a]">
                    <span className="phrase whitespace-nowrap">PNG・JPG・JPEG</span>
                    <span className="phrase whitespace-nowrap">/ 複数選択できます</span>
                  </p>
                </div>
                <span className="inline-flex h-11 items-center rounded-xl bg-[#155eef] px-5 text-sm font-bold text-white shadow-[0_4px_0_#0b3da8]">
                  ＋ 画像を選択
                </span>
              </button>

              {message && (
                <p className="mt-3 flex items-start gap-2 text-pretty text-sm font-semibold text-[#ba2a33]" role="alert">
                  <X className="mt-0.5 size-4 shrink-0" />
                  <span className="break-words">{message}</span>
                </p>
              )}

              <div className="mt-6 rounded-2xl bg-[#f1f5f8] p-4 sm:p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <label className="text-sm font-black text-[#10233f]" htmlFor="quality-slider">画質</label>
                    <p className="mt-1 text-xs text-[#66758a]">迷ったら80%がおすすめです</p>
                  </div>
                  <output className="min-w-[4.5rem] text-right text-3xl font-black tracking-[-0.06em] text-[#155eef]" aria-live="polite">
                    {quality}<span className="ml-0.5 text-base">%</span>
                  </output>
                </div>
                <Slider
                  id="quality-slider"
                  className="mt-5 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-[#cfdae5] [&_[data-slot=slider-range]]:bg-[#155eef] [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-4 [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:bg-[#155eef] [&_[data-slot=slider-thumb]]:shadow-[0_0_0_2px_#155eef]"
                  min={10}
                  max={100}
                  step={1}
                  value={[quality]}
                  onValueChange={(value) => setQuality(Array.isArray(value) ? value[0] : value)}
                  aria-label="WebP画質"
                />
                <div className="mt-2 flex justify-between text-[11px] font-bold text-[#7b899a]">
                  <span>軽い 10%</span><span>高画質 100%</span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#9fd7b6] bg-[#eefbf2] px-4 py-3.5 text-[#225f3e]">
                <LockKeyhole className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-black"><span className="phrase">画像はアップロードされません。</span></p>
                  <p className="mt-0.5 text-xs leading-5 text-[#3d7657]">
                    <span className="phrase">変換処理はすべて、</span>
                    <span className="phrase">お使いのブラウザ内で実行されます。</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="results-heading">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#10233f] pb-5">
          <div>
            <p className="text-[11px] font-black tracking-[0.18em] text-[#155eef]">02 / RESULT</p>
            <h2 id="results-heading" className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#10233f]">変換結果</h2>
          </div>
          {items.length > 0 && <p className="text-sm font-bold text-[#66758a]">{completed.length} / {items.length}枚 完了</p>}
        </div>

        {items.length === 0 ? (
          <div className="grid min-h-56 place-items-center border-x border-b border-[#d9e0e8] bg-white px-6 text-center">
            <div>
              <FileImage className="mx-auto size-10 text-[#9ba8b7]" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-3 font-bold text-[#526174]">
                <span className="phrase">画像を選択すると、</span>
                <span className="phrase">ここに変換結果が表示されます。</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#d9e0e8] border-x border-b border-[#d9e0e8] bg-white">
            {items.map((item) => (
              <article key={item.id} className="grid gap-4 p-4 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center sm:p-5">
                <div className="h-[72px] w-[88px] overflow-hidden rounded-xl bg-[#edf1f5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="h-full w-full object-cover" src={item.previewUrl} alt="" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-black text-[#10233f]">{item.file.name}</h3>
                    <button className="grid size-7 shrink-0 place-items-center rounded-full text-[#7b899a] hover:bg-[#edf1f5] hover:text-[#ba2a33]" onClick={() => removeItem(item.id)} aria-label={`${item.file.name}を削除`}>
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  {item.status === 'converting' ? (
                    <output className="mt-2 flex items-center gap-2 text-sm font-bold text-[#155eef]">
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />変換中…
                    </output>
                  ) : item.status === 'error' ? (
                    <p className="mt-2 text-sm font-semibold text-[#ba2a33]" role="alert">{item.error}</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold text-[#66758a]">{formatFileSize(item.file.size)}</span>
                      <ArrowRight className="size-4 text-[#9ba8b7]" aria-hidden="true" />
                      <span className="font-black text-[#10233f]">{formatFileSize(item.webp!.size)}</span>
                      <span className="rounded-full bg-[#e7f9ed] px-2 py-1 text-xs font-black text-[#16834d]">{getReduction(item.file.size, item.webp!.size)}%削減</span>
                    </div>
                  )}
                  {item.width && item.height && <p className="mt-1 text-xs text-[#8a96a5]">{item.width.toLocaleString()} × {item.height.toLocaleString()} px</p>}
                </div>
                {item.status === 'done' && item.webp && (
                  <Button variant="outline" size="lg" className="h-10 justify-self-start rounded-xl border-[#10233f]/20 px-4 font-bold text-[#10233f] hover:bg-[#f1f5f8] sm:justify-self-end" onClick={() => triggerDownload(item.webp!, webpName(item.file.name))}>
                    <ArrowDownToLine aria-hidden="true" />WebPを保存
                  </Button>
                )}
              </article>
            ))}
          </div>
        )}

        {allComplete && (
          <div className="mt-6 grid gap-5 rounded-[22px] bg-[#10233f] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
            <div>
              <p className="flex items-start gap-2 text-pretty text-lg font-black leading-7">
                <Zap className="mt-1 size-5 shrink-0 fill-[#c8f45f] text-[#c8f45f]" />
                <span>{completed.length}枚の画像を変換しました。</span>
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-sm text-white/65">
                <span>元データ <b className="ml-1 text-white">{formatFileSize(originalTotal)}</b></span>
                <span>WebP <b className="ml-1 text-white">{formatFileSize(convertedTotal)}</b></span>
                <span className="rounded-full bg-[#c8f45f] px-2.5 py-1 font-black text-[#10233f]">{getReduction(originalTotal, convertedTotal)}%削減</span>
              </div>
            </div>
            <Button size="lg" className="h-12 rounded-xl bg-[#c8f45f] px-5 font-black text-[#10233f] shadow-[0_4px_0_#7c9b33] hover:bg-[#d5fa7f]" onClick={() => void downloadAll()} disabled={zipping}>
              {zipping ? <LoaderCircle className="animate-spin" /> : <ArrowDownToLine />}
              {completed.length === 1 ? 'WebPをダウンロード' : 'すべてZIPでダウンロード'}
            </Button>
          </div>
        )}
      </section>

      <section id="privacy" className="border-y border-[#10233f]/10 bg-[#e9f0ff]">
        <div className="mx-auto grid max-w-[1240px] gap-7 px-5 py-10 sm:px-8 md:grid-cols-[auto_1fr] md:items-center md:py-12">
          <div className="grid size-16 place-items-center rounded-2xl bg-[#155eef] text-white shadow-[6px_6px_0_#10233f]">
            <LockKeyhole className="size-7" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-black leading-8 tracking-[-0.035em] text-[#10233f]">
              <span className="phrase">あなたの画像は、</span>
              <span className="phrase">あなたの端末の中だけ。</span>
            </h2>
            <p className="mt-2 max-w-3xl text-pretty text-sm leading-7 text-[#526174] sm:text-base">
              <span className="phrase">元画像も変換後のWebPも、</span>
              <span className="phrase">外部サーバーへ送信・保存しません。</span>
              <span className="phrase">履歴やファイル名も残らず、</span>
              <span className="phrase">ページを閉じればデータは消えます。</span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-[0.7fr_1.3fr] md:py-20">
          <div>
            <p className="text-[11px] font-black tracking-[0.18em] text-[#155eef]">ABOUT US</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#10233f]">
              <span className="phrase">このツールを</span>
              <span className="phrase">つくっている会社</span>
            </h2>
          </div>
          <div className="border-l-4 border-[#c8f45f] pl-5 sm:pl-8">
            <p className="text-xl font-black text-[#10233f]">株式会社machi-hub</p>
            <p className="mt-3 max-w-2xl text-pretty text-base leading-8 text-[#526174]">
              <span className="phrase">京都を拠点に、</span>
              <span className="phrase">Web・グラフィック・空間・仕組みづくりまで、</span>
              <span className="phrase">モノとコトを横断して、</span>
              <span className="phrase">ディレクションするデザイン事務所です。</span>
            </p>
            <a className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#10233f] pb-1 text-sm font-black text-[#10233f] transition-colors hover:border-[#155eef] hover:text-[#155eef]" href="https://www.machihub-design.com/" target="_blank" rel="noreferrer">
              machi-hubについて <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#10233f] text-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="font-bold tracking-[0.08em]">machi-hub tools</div>
          <nav className="flex flex-wrap gap-5 text-white/65" aria-label="フッターナビゲーション">
            <a className="hover:text-white" href="#privacy">Privacy Policy</a>
            <a className="hover:text-white" href="https://www.machihub-design.com/" target="_blank" rel="noreferrer">machi-hub</a>
          </nav>
          <p className="text-white/45">© machi-hub Inc.</p>
        </div>
      </footer>
    </main>
  );
}
