import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileImage,
  Images,
  Layers3,
  MoveRight,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

const title = 'WebPとは？画像を軽くする仕組み・PNGとJPEGとの違い';
const description =
  'WebPの仕組み、PNG・JPEGとの違い、使いどころ、変換時の画質設定を図解で紹介します。ブラウザ内だけで使える無料WebP変換ツールも利用できます。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/webp' },
  openGraph: { title, description, url: '/webp' },
};

const comparison = [
  ['写真', '◎', '◎', '○', '△'],
  ['イラスト・ロゴ', '◎', '△', '◎', '△'],
  ['透過背景', '◎', '×', '◎', '△'],
  ['アニメーション', '○', '×', '×', '◎'],
  ['Webでの軽量化', '◎', '○', '△', '△'],
];

export default function WebpGuidePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/12 bg-[#10233f] text-white">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link className="group flex items-center gap-3" href="/" aria-label="machi-hub tools トップへ戻る">
            <span className="grid size-8 place-items-center rounded-full bg-[#c8f45f] text-[11px] font-black tracking-[-0.08em] text-[#10233f] transition-transform group-hover:rotate-6">mh</span>
            <span className="text-sm font-bold tracking-[0.08em]">machi-hub tools</span>
          </Link>
          <Link className="hidden items-center gap-2 text-sm font-bold text-white/80 hover:text-white sm:inline-flex" href="/"><ArrowLeft className="size-4" />変換ツールへ</Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#10233f]/10 bg-[#e9f0ff]">
        <div className="pointer-events-none absolute inset-0 grid-paper opacity-60" />
        <div className="relative mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#10233f]/15 bg-white px-3 py-1.5 text-xs font-black tracking-[0.1em] text-[#155eef]"><Sparkles className="size-3.5" />IMAGE FORMAT GUIDE</p>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.065em] text-[#10233f] sm:text-5xl">WebPとは？<br /><span className="text-[#155eef]">画像を軽くする</span>新しい選択肢</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#42526a] sm:text-lg">WebP（ウェッピー）は、Webサイトで使う画像を、見た目を保ちながら軽くするための画像形式です。写真・イラスト・透過画像まで、用途に合わせて扱えます。</p>
            <Link className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#155eef] px-5 text-sm font-black text-white shadow-[0_4px_0_#0b3da8] transition-transform hover:-translate-y-0.5" href="/"><WandSparkles className="size-4" />無料でWebPに変換する</Link>
          </div>

          <figure className="relative rounded-[28px] border-2 border-[#10233f] bg-white p-5 shadow-[10px_10px_0_#10233f] sm:p-7">
            <figcaption className="flex items-center justify-between border-b border-[#d9e0e8] pb-4 text-xs font-black tracking-[0.12em] text-[#66758a]"><span>IMAGE DELIVERY</span><span className="text-[#16834d]">LIGHTER FOR WEB</span></figcaption>
            <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
              <div className="rounded-2xl border border-[#d9e0e8] bg-[#f7f9fc] p-3 sm:p-4">
                <div className="grid aspect-[4/3] place-items-center rounded-xl bg-[linear-gradient(135deg,#f1b576_0%,#f1b576_36%,#426b9b_36%,#426b9b_65%,#f4e8bd_65%)]"><FileImage className="size-8 text-white/90" /></div>
                <p className="mt-3 text-xs font-black text-[#10233f] sm:text-sm">JPEG / PNG</p>
                <p className="mt-1 text-xs text-[#66758a]">元の画像</p>
              </div>
              <div className="grid size-9 place-items-center rounded-full bg-[#c8f45f] text-[#10233f] sm:size-11"><ArrowRight className="size-5" /></div>
              <div className="rounded-2xl border-2 border-[#155eef] bg-[#eef4ff] p-3 sm:p-4">
                <div className="grid aspect-[4/3] place-items-center rounded-xl bg-[linear-gradient(135deg,#f1b576_0%,#f1b576_36%,#426b9b_36%,#426b9b_65%,#f4e8bd_65%)]"><FileImage className="size-8 text-white/90" /></div>
                <p className="mt-3 text-xs font-black text-[#155eef] sm:text-sm">WebP</p>
                <p className="mt-1 text-xs text-[#16834d]">軽量化して配信</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-[#10233f] px-4 py-3 text-center text-sm font-bold text-white">画像の容量を抑えるほど、ページの読み込み負荷も下げやすくなります。</div>
            <p className="mt-3 text-center text-xs leading-5 text-[#7b899a]">軽量化の度合いは、元画像・画質設定・画像内容によって変わります。</p>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-black tracking-[0.18em] text-[#155eef]">01 / WHAT WEBP DOES</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#10233f]">WebPは「軽さ」と「表現」を<br />両立しやすい形式です。</h2>
          <p className="mt-5 text-base leading-8 text-[#526174]">WebPは、データを小さくする非可逆圧縮と、元に戻せる可逆圧縮のどちらにも対応します。透過背景やアニメーションにも対応できるため、Web上の多様な画像に使えます。</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#d9e0e8] bg-white p-6"><div className="grid size-11 place-items-center rounded-xl bg-[#eaf0ff] text-[#155eef]"><Layers3 className="size-5" /></div><h3 className="mt-5 text-lg font-black text-[#10233f]">圧縮方式を選べる</h3><p className="mt-2 text-sm leading-7 text-[#526174]">写真向けの非可逆圧縮と、細部を保ちたい画像向けの可逆圧縮に対応します。</p></article>
          <article className="rounded-2xl border border-[#d9e0e8] bg-white p-6"><div className="grid size-11 place-items-center rounded-xl bg-[#eefbf2] text-[#16834d]"><Images className="size-5" /></div><h3 className="mt-5 text-lg font-black text-[#10233f]">透過も扱える</h3><p className="mt-2 text-sm leading-7 text-[#526174]">ロゴや切り抜き画像など、背景を透明にした画像をWeb用に軽量化できます。</p></article>
          <article className="rounded-2xl border border-[#d9e0e8] bg-white p-6"><div className="grid size-11 place-items-center rounded-xl bg-[#fff4d9] text-[#9a6700]"><MoveRight className="size-5" /></div><h3 className="mt-5 text-lg font-black text-[#10233f]">配信を軽くしやすい</h3><p className="mt-2 text-sm leading-7 text-[#526174]">画像の転送量を減らせると、モバイル回線を含むページ表示の負荷を抑えやすくなります。</p></article>
        </div>
      </section>

      <section className="border-y border-[#10233f]/10 bg-[#f1f5f8]">
        <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-[11px] font-black tracking-[0.18em] text-[#155eef]">02 / FORMAT COMPARISON</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#10233f]">JPEG・PNG・GIFとどう違う？</h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d9e0e8] bg-white">
            <table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-[#10233f] text-white"><tr><th className="px-5 py-4 font-black">用途・特徴</th><th className="bg-[#155eef] px-5 py-4 font-black">WebP</th><th className="px-5 py-4 font-black">JPEG</th><th className="px-5 py-4 font-black">PNG</th><th className="px-5 py-4 font-black">GIF</th></tr></thead><tbody>{comparison.map(([label, webp, jpeg, png, gif]) => <tr key={label} className="border-t border-[#d9e0e8]"><th className="px-5 py-4 font-bold text-[#10233f]">{label}</th><td className="bg-[#eef4ff] px-5 py-4 font-black text-[#155eef]">{webp}</td><td className="px-5 py-4 text-[#526174]">{jpeg}</td><td className="px-5 py-4 text-[#526174]">{png}</td><td className="px-5 py-4 text-[#526174]">{gif}</td></tr>)}</tbody></table>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#526174]">WebPは万能ではありません。印刷用の元データや、何度も編集する作業用ファイルは、元のPNG・JPEGなども保管しておくと安心です。</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[11px] font-black tracking-[0.18em] text-[#155eef]">03 / QUALITY AND SIZE</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#10233f]">画質の設定は、<br />「見た目」と「容量」のバランス。</h2>
            <p className="mt-5 text-base leading-8 text-[#526174]">画質を高くすると細部を残しやすくなり、ファイル容量は大きくなります。写真や背景画像は80%前後から試し、文字や細い線を含む画像は実際に見比べて調整するのがおすすめです。</p>
          </div>
          <figure className="rounded-[24px] border-2 border-[#10233f] bg-white p-5 sm:p-7"><figcaption className="text-sm font-black text-[#10233f]">画質設定の目安</figcaption><div className="mt-6 space-y-5"><div><div className="flex justify-between text-xs font-bold text-[#66758a]"><span>60%</span><span>容量を優先</span></div><div className="mt-2 h-4 rounded-full bg-[#eaf0ff]"><div className="h-full w-[42%] rounded-full bg-[#155eef]" /></div></div><div><div className="flex justify-between text-xs font-bold text-[#66758a]"><span>80%</span><span>迷ったらここ</span></div><div className="mt-2 h-4 rounded-full bg-[#eaf0ff]"><div className="h-full w-[66%] rounded-full bg-[#155eef]" /></div></div><div><div className="flex justify-between text-xs font-bold text-[#66758a]"><span>95%</span><span>細部を優先</span></div><div className="mt-2 h-4 rounded-full bg-[#eaf0ff]"><div className="h-full w-[88%] rounded-full bg-[#155eef]" /></div></div></div><div className="mt-7 flex items-start gap-3 rounded-xl bg-[#fff4d9] p-4 text-sm leading-6 text-[#73520d]"><Check className="mt-0.5 size-4 shrink-0" />用途や画像の内容によって最適な値は変わります。公開前に実際の表示サイズで確認しましょう。</div></figure>
        </div>
      </section>

      <section className="border-y border-[#10233f]/10 bg-[#e9f0ff]">
        <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-[11px] font-black tracking-[0.18em] text-[#155eef]">04 / HOW TO CONVERT</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#10233f]">変換は3ステップ。<br />画像は端末の外に出ません。</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3 md:gap-0"><div className="rounded-2xl bg-white p-6 md:rounded-r-none"><span className="text-xs font-black text-[#155eef]">STEP 01</span><h3 className="mt-3 text-lg font-black text-[#10233f]">画像を選ぶ</h3><p className="mt-2 text-sm leading-7 text-[#526174]">PNG・JPEGを選択、またはドラッグ＆ドロップします。</p></div><div className="rounded-2xl bg-white p-6 md:relative md:rounded-none md:border-x md:border-[#d9e0e8]"><span className="text-xs font-black text-[#155eef]">STEP 02</span><h3 className="mt-3 text-lg font-black text-[#10233f]">画質を決める</h3><p className="mt-2 text-sm leading-7 text-[#526174]">必要に応じて画質を調整。大きな画像は横幅1920pxまで縮小します。</p></div><div className="rounded-2xl bg-white p-6 md:rounded-l-none"><span className="text-xs font-black text-[#155eef]">STEP 03</span><h3 className="mt-3 text-lg font-black text-[#10233f]">WebPを保存</h3><p className="mt-2 text-sm leading-7 text-[#526174]">結果を確認して個別、またはまとめてダウンロードします。</p></div></div>
          <Link className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#10233f] px-5 text-sm font-black text-white hover:bg-[#155eef]" href="/">WebP変換ツールを使う<ChevronRight className="size-4" /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-20"><div className="rounded-[26px] bg-[#10233f] p-7 text-white sm:p-10"><p className="text-[11px] font-black tracking-[0.18em] text-[#c8f45f]">FOR WEBSITE OPERATORS</p><h2 className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">WebPを導入するときのチェックポイント</h2><ul className="mt-7 grid gap-4 md:grid-cols-3"><li className="rounded-xl border border-white/15 p-4 text-sm leading-7 text-white/75"><b className="block text-white">元ファイルも残す</b>再編集や印刷に備え、公開用WebPとは別に元画像を保管します。</li><li className="rounded-xl border border-white/15 p-4 text-sm leading-7 text-white/75"><b className="block text-white">表示サイズに合わせる</b>必要以上に大きな画像を配信しないよう、画像の寸法も見直します。</li><li className="rounded-xl border border-white/15 p-4 text-sm leading-7 text-white/75"><b className="block text-white">実機で確認する</b>文字のにじみや写真の細部を、公開するサイズで確認します。</li></ul></div></section>

      <footer className="bg-[#10233f] text-white"><div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8"><span className="font-bold tracking-[0.08em]">machi-hub tools</span><div className="flex gap-5 text-white/65"><Link className="hover:text-white" href="/">WebP Converter</Link><Link className="hover:text-white" href="/privacy">Privacy Policy</Link></div><span className="text-white/45">© machi-hub Inc.</span></div></footer>
    </main>
  );
}
