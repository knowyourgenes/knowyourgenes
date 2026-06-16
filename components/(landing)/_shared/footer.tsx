import { KygLogo } from '@/components/site/logo';

export default function LandingFooter({
  bg = '#1A2220',
  learn = ['What is PCOS', 'How it works', 'Sample report', 'FAQs'],
}: {
  bg?: string;
  learn?: string[];
}) {
  const columns: { title: string; links: string[] }[] = [
    { title: 'Women’s Health', links: ['PCOS Risk', 'Pregnancy Loss', 'Depression Risk', 'Bone Health', 'Arthritis Risk'] },
    { title: 'Learn', links: learn },
    { title: 'Company', links: ['About', 'Privacy & Trust', 'Careers', 'Contact'] },
  ];
  return (
    <footer className="relative overflow-hidden pt-[80px] pb-[36px]" style={{ backgroundColor: bg }}>
      {/* radial teal glow, top-right */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[427px]"
        style={{ background: 'radial-gradient(circle at 90% 0%, rgba(37,181,171,0.12) 0%, rgba(37,181,171,0) 60%)' }}
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-10 md:px-16 lg:px-[120px]">
        <div className="flex flex-col gap-[64px]">
          <div className="grid grid-cols-1 gap-[48px] md:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_1fr] lg:gap-[40px]">
            {/* brand + newsletter */}
            <div className="flex flex-col gap-[19px] pb-[16px]">
              <KygLogo tone="light" className="h-9 w-auto" />
              <p className="max-w-[300px] text-[14.5px] leading-[23.5px] text-[rgba(250,246,239,0.7)]">
                A genomics brand built for Indian biology. Your health deserves specificity.
              </p>
              <form className="mt-[2px] flex max-w-[360px] items-stretch rounded-full border border-[#E5E7EB]/15 bg-white/[0.04] p-[4px]">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent px-[16px] py-[10px] text-[13.5px] text-[#FAF6EF] placeholder:text-[rgba(250,246,239,0.5)] focus:outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-[#F3D5B2] px-[20px] py-[10px] text-[13px] font-semibold text-[#1F1A14] transition-colors hover:bg-[#f6deba]"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* link columns */}
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-[20px]">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F3D5B2]">{col.title}</h3>
                <ul className="flex flex-col gap-[12px]">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[14px] leading-[21px] text-[rgba(250,246,239,0.7)] transition-colors hover:text-[#FAF6EF]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* bottom bar */}
          <div className="flex flex-col gap-[18px] border-t border-white/10 pt-[28px] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] leading-[19.5px] text-[rgba(250,246,239,0.7)]">
              © 2026 KnowYourGenes. All rights reserved.
            </p>
            <p className="text-[13px] font-semibold leading-[19.5px]">
              <span className="text-[#FAF6EF]">KYG</span>
              <span className="text-[#F3D5B2]"> · </span>
              <span className="text-[#FAF6EF]">Health Without Guesswork.</span>
            </p>
            <div className="flex items-center gap-[20px]">
              {['Instagram', 'LinkedIn', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[13px] leading-[19.5px] text-[rgba(250,246,239,0.7)] transition-colors hover:text-[#FAF6EF]"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
