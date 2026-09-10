import type { Metadata } from 'next';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'プライバシーポリシー｜machi-hub WebP Converter',
  description: 'machi-hub WebP Converterのプライバシーポリシーです。',
};

const sections = [
  {
    title: '1. 基本方針',
    body: '株式会社machi-hub（以下「当社」）は、本ツールをご利用いただく方のプライバシーを大切にします。このページでは、machi-hub WebP Converterにおける情報の取り扱いを説明します。',
  },
  {
    title: '2. 画像データの取り扱い',
    body: '選択された画像は、お使いのブラウザ内でのみ変換処理を行います。画像データ、変換後のWebPファイル、ファイル名、変換履歴を、当社または第三者のサーバーへ送信・保存することはありません。ページを閉じる、またはリセットすることで、画面上のデータは削除されます。',
  },
  {
    title: '3. 収集する情報',
    body: '本ツールは、画像データを収集しません。また、現時点では、本ツール内で広告配信、アクセス解析、ユーザーを識別するためのCookieを使用していません。',
  },
  {
    title: '4. 外部サイトへのリンク',
    body: '本ツールには、当社サイトなど外部サイトへのリンクが含まれる場合があります。リンク先での情報の取り扱いについては、それぞれのサイトの方針をご確認ください。',
  },
  {
    title: '5. ポリシーの変更',
    body: '本ポリシーは、法令の変更や本ツールの機能変更に応じて更新することがあります。更新後の内容は、このページに掲載した時点から適用されます。',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/12 bg-[#10233f] text-white">
        <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between px-5 sm:px-8">
          <a className="group flex items-center gap-3" href="/" aria-label="machi-hub tools トップへ戻る">
            <span className="grid size-8 place-items-center rounded-full bg-[#c8f45f] text-[11px] font-black tracking-[-0.08em] text-[#10233f] transition-transform group-hover:rotate-6">mh</span>
            <span className="text-sm font-bold tracking-[0.08em]">machi-hub tools</span>
          </a>
          <span className="text-xs font-semibold text-white/70">Privacy Policy</span>
        </div>
      </header>

      <section className="border-b border-[#10233f]/10 bg-[#e9f0ff]">
        <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#155eef] text-white shadow-[5px_5px_0_#10233f]">
            <LockKeyhole className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-7 text-[11px] font-black tracking-[0.18em] text-[#155eef]">PRIVACY POLICY</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.055em] text-[#10233f] sm:text-4xl">プライバシーポリシー</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#526174]">machi-hub WebP Converterにおける、情報と画像データの取り扱いについてお知らせします。</p>
        </div>
      </section>

      <section className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="rounded-2xl border border-[#9fd7b6] bg-[#eefbf2] p-5 text-[#225f3e] sm:p-6">
          <p className="flex items-start gap-3 text-base font-black leading-7"><ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />画像は外部サーバーに送信されません。</p>
          <p className="mt-2 pl-8 text-sm leading-6 text-[#3d7657]">変換はすべて、ご利用のブラウザ内で完了します。</p>
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#10233f]">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-[#526174]">{section.body}</p>
            </section>
          ))}
          <section>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#10233f]">6. お問い合わせ</h2>
            <p className="mt-3 text-base leading-8 text-[#526174]">本ポリシーに関するお問い合わせは、株式会社machi-hubのウェブサイトよりご連絡ください。</p>
            <a className="mt-4 inline-flex items-center gap-2 border-b-2 border-[#10233f] pb-1 text-sm font-black text-[#10233f] transition-colors hover:border-[#155eef] hover:text-[#155eef]" href="https://www.machihub-design.com/" target="_blank" rel="noreferrer">株式会社machi-hub ウェブサイト</a>
          </section>
        </div>

        <p className="mt-12 border-t border-[#d9e0e8] pt-5 text-xs text-[#7b899a]">制定日：2026年9月10日</p>
        <a className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#10233f] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#155eef]" href="/"><ArrowLeft className="size-4" aria-hidden="true" />WebP Converterに戻る</a>
      </section>
    </main>
  );
}
