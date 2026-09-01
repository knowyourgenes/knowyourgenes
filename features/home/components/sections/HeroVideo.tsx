'use client';

// =============================================================================
// features/home/v3 - the hero's background video
// -----------------------------------------------------------------------------
// A decorative, silent, looping background layer that sits ON TOP of the hero's
// poster photograph. The photograph stays in the DOM underneath and is what
// shows whenever the video does not: before it can play, if the file is missing,
// if the browser blocks autoplay, or if the visitor has asked for reduced
// motion. That layering is the whole design - there is no state in which this
// hero renders as a black box.
//
// A CLIENT component for one reason: `prefers-reduced-motion`. A full-screen
// autoplaying video is exactly what that setting exists to suppress, and it
// cannot be honoured in CSS alone - `motion-reduce:hidden` would still download
// and decode the file. Checking it in JS means those visitors never fetch it.
//
// The poster image is NOT set via the `poster` attribute. It is a real
// `next/image` with `priority` in the parent, so it is preloaded, responsive and
// the measured LCP element. A `poster` attribute would be none of those.
// =============================================================================

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Drop the files here and this starts playing. Until then the hero shows the
 * poster photograph and nothing errors.
 *
 *   public/hero.mp4    ← the current source
 *   public/hero.webm   ← worth adding: VP9 is roughly half the bytes of h.264
 *                        at the same quality, and every browser except Safari
 *                        will prefer it
 *
 * SIZE IS THE WHOLE BALLGAME for a background loop. This autoplays, so the
 * browser fetches it on load whether or not anyone looks at it - fixed cost, on
 * the most important page. Budget 2-3MB. From a master file:
 *
 *   ffmpeg -i master.mp4 -t 10 -an -vf "scale=1920:-2,fps=24" \
 *     -c:v libx264 -crf 30 -preset slow -movflags +faststart public/hero.mp4
 *
 *   ffmpeg -i master.mp4 -t 10 -an -vf "scale=1920:-2,fps=24" \
 *     -c:v libvpx-vp9 -crf 40 -b:v 0 public/hero.webm
 *
 * -an strips the audio track (this element is muted, so it is dead weight) and
 * +faststart moves the index to the front so playback can start before the file
 * has finished arriving.
 *
 * Content brief: ~8-12s, silent, seamless loop. It sits behind a dark scrim with
 * type across the middle of the frame, so it wants slow ambient motion and an
 * uncluttered centre - anything with fast cuts will fight the headline.
 */
const SOURCES = [
  // { src: '/home/hero.webm', type: 'video/webm' },
  { src: '/hero.mp4', type: 'video/mp4' },
];

export function HeroVideo({ className }: { className?: string }) {
  // `null` = undecided (server render and first paint). Nothing is rendered
  // until we know, so a reduced-motion visitor never sees a frame or a request.
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setAllowed(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (!allowed || failed) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      // Decorative. The alt text lives on the poster image underneath, and a
      // focusable background video is a keyboard trap with nothing in it.
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
      preload="auto"
      onCanPlay={() => setReady(true)}
      // A missing or unplayable file unmounts this layer entirely rather than
      // leaving a transparent box over the photograph.
      onError={() => setFailed(true)}
      className={cn(
        'absolute inset-0 h-full w-full object-cover object-[58%_center]',
        // Fade in on the first playable frame so the swap from photograph to
        // video is a cross-dissolve, not a cut.
        'transition-opacity duration-700 ease-(--e-out)',
        ready ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {SOURCES.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}

export default HeroVideo;
