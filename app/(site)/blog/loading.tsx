import { Container } from '@/components/shared/Container';
import { SECTION_Y } from '@/components/shared/kyg';

/**
 * The /blog skeleton.
 *
 * It mirrors the shape of the real page (Figma 343:647) rather than a generic
 * card grid: masthead, filter bar, hairline, one wide featured card, then two
 * rows of three. A skeleton whose layout does not match what replaces it reads
 * as a second, broken page for the moment it is up.
 */
const BAR = 'animate-pulse rounded-sm bg-zeus/[0.06]';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-linenw">
      <Container className={SECTION_Y}>
        <div className={BAR + ' h-[30px] w-[168px]'} />
        <div className={BAR + ' mt-[16px] h-[42px] w-[min(560px,80%)]'} />
        <div className={BAR + ' mt-[10px] h-[42px] w-[min(430px,64%)]'} />
        <div className={BAR + ' mt-[18px] h-[20px] w-[min(440px,72%)]'} />
      </Container>

      <Container className={SECTION_Y}>
        <div className="flex flex-wrap items-center gap-[clamp(12px,1.667vw,26.7px)]">
          <div className={BAR + ' h-[14px] w-[52px]'} />
          <div
            className={
              BAR + ' h-[clamp(31.3px,3.056vw,48.9px)] min-w-[200px] flex-1 lg:max-w-[clamp(426.7px,41.667vw,666.7px)]'
            }
          />
          <div className="hidden flex-1 lg:block" />
          <div className={BAR + ' h-[clamp(31.3px,3.056vw,48.9px)] w-[132px]'} />
        </div>

        <div className="mt-[clamp(12px,1.389vw,22.2px)] h-px w-full bg-zeus/[0.08]" />

        {/* featured - 440.89 / 526.22 of the rail, as the frame splits it */}
        <div className="mt-[clamp(20px,2.222vw,35.6px)] grid overflow-hidden rounded-sm ring-1 ring-inset ring-zeus/10 lg:grid-cols-[minmax(0,440.89fr)_minmax(0,526.22fr)]">
          <div className={BAR + ' min-h-[clamp(180px,21vw,336px)] rounded-none'} />
          <div className="bg-white p-[clamp(20px,3.333vw,53.3px)]">
            <div className={BAR + ' h-[20px] w-[86px]'} />
            <div className={BAR + ' mt-[16px] h-[30px] w-[86%]'} />
            <div className={BAR + ' mt-[10px] h-[18px] w-full'} />
            <div className={BAR + ' mt-[8px] h-[18px] w-[64%]'} />
            <div className={BAR + ' mt-[26px] h-[44px] w-[148px]'} />
          </div>
        </div>

        <div className="mt-[clamp(20px,2.222vw,35.6px)] grid gap-[clamp(14.2px,1.389vw,22.2px)] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-zeus/10">
              <div className={BAR + ' h-[clamp(140px,14.583vw,233.3px)] rounded-none'} />
              <div className="px-[clamp(14px,1.667vw,26.7px)] pb-[clamp(14px,1.667vw,26.7px)] pt-[clamp(13px,1.528vw,24.4px)]">
                <div className={BAR + ' h-[18px] w-[78px]'} />
                <div className={BAR + ' mt-[10px] h-[22px] w-[90%]'} />
                <div className={BAR + ' mt-[8px] h-[15px] w-full'} />
                <div className={BAR + ' mt-[6px] h-[15px] w-[58%]'} />
                <div className={BAR + ' mt-[16px] h-[14px] w-[76%]'} />
                <div className={BAR + ' mt-[12px] h-[44px] w-[124px]'} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
