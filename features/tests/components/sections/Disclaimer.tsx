import type { DisclaimerSection, Ground } from '../../types';

// =============================================================================
// The medical/legal line between the closing CTA and the footer
// (spec 017645_div-bg-white):
//
//   div.bg-white  1440 × 59.75, pad 19/80/20/80, fill #ffffff, stroke
//                 #222222@10 on the TOP EDGE ONLY. The dump prints `@1.0`,
//                 but that trailing `@N` is only the base strokeWeight - the
//                 node also carries individualStrokeWeights
//                 {top:1, right:0, bottom:0, left:0}, so it is a single 1px
//                 rule along the top. (The header and the footer's grid
//                 divider are the same shape with a base of `@0.0`.) Never
//                 read `@1.0` as "ringed on four edges": a border on all
//                 sides would paint vertical hairlines at x=0 / x=1439 and
//                 shrink the inner rail to 1278. Height 59.75 =
//                 19 padTop + 19.75 content + 20 padBottom + 1 top stroke
//                 (strokesIncludedInLayout).
//   div.mx-auto   1280 × 20, pad 0/20/0.75/20, CENTER
//   copy          Figtree 400 12.5/18.75, centred, #5b564e (fuscous - not the
//                 lighter boulder grey).
//
// SMALL SCREENS. The rail's own 20px pad is a 1280-rail inset, and on a phone
// it stacks on top of the section gutter: 20 + 20 a side leaves a 240 measure
// at 320 for 12.5px type (~34 characters, and this is a four-line paragraph).
// So the inset only starts at sm, where the gutter has grown anyway and the
// two no longer compete. Identical from 640 up. `break-words` is insurance on
// the injected HTML - the shipped copy has no token long enough to need it,
// but a URL or an email dropped into `bodyHtml` later would otherwise push a
// scrollbar rather than wrap.
// =============================================================================

export default function Disclaimer({ data }: { data: DisclaimerSection; ground?: Ground }) {
  return (
    <div className="border-t border-mine/10 bg-white px-5 pb-5 pt-[19px] sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-[1600px] px-0 pb-[0.75px] sm:px-5">
        <p
          className="break-words text-center font-kyg text-[12.5px] font-normal leading-[18.75px] text-fusc"
          dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
        />
      </div>
    </div>
  );
}
