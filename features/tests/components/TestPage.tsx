import type { Section, TestPage } from '../types';
import RevealRoot from './RevealRoot';
import ScrollProgress from './ScrollProgress';
import Aspiration from './sections/Aspiration';
import BodyMap from './sections/BodyMap';
import Contrast from './sections/Contrast';
import Counsellor from './sections/Counsellor';
import Disclaimer from './sections/Disclaimer';
import Explainer from './sections/Explainer';
import Faqs from './sections/Faqs';
import FinalCta from './sections/FinalCta';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Kit from './sections/Kit';
import MarkerGrid from './sections/MarkerGrid';
import Nav from './sections/Nav';
import Outcomes from './sections/Outcomes';
import ReportPreview from './sections/ReportPreview';
import RiskCards from './sections/RiskCards';
import Steps from './sections/Steps';
import Stats from './sections/Stats';
import Testimonial from './sections/Testimonial';
import ThenNow from './sections/ThenNow';
import Timeline from './sections/Timeline';
import Trust from './sections/Trust';
import WhoFor from './sections/WhoFor';
import Worth from './sections/Worth';

/**
 * Renders one component per entry in `page.sections`, in array order.
 *
 * The switch is EXHAUSTIVE: the `never` assignment at the bottom makes TypeScript
 * fail the build if a new member is added to the `Section` union without a case
 * here. That is the whole point of the discriminated union - data and renderer
 * cannot drift apart silently.
 *
 * This component stays a server component. Only the four sections that need
 * browser state (Nav, BodyMap, RiskCards, Faqs) and the reveal wrapper are
 * `'use client'`, so the bulk of this very long page ships as zero JS.
 */
function renderSection(section: Section & { ground?: TestPage['sections'][number]['ground'] }, key: number) {
  const ground = section.ground;

  switch (section.type) {
    case 'nav':
      return <Nav key={key} data={section} />;
    case 'hero':
      return <Hero key={key} data={section} />;
    case 'whoFor':
      return <WhoFor key={key} data={section} ground={ground} />;
    case 'aspiration':
      return <Aspiration key={key} data={section} ground={ground} />;
    case 'thenNow':
      return <ThenNow key={key} data={section} ground={ground} />;
    case 'bodyMap':
      return <BodyMap key={key} data={section} ground={ground} />;
    case 'riskCards':
      return <RiskCards key={key} data={section} ground={ground} />;
    case 'markerGrid':
      return <MarkerGrid key={key} data={section} ground={ground} />;
    case 'stats':
      return <Stats key={key} data={section} ground={ground} />;
    case 'explainer':
      return <Explainer key={key} data={section} ground={ground} />;
    case 'timeline':
      return <Timeline key={key} data={section} ground={ground} />;
    case 'contrast':
      return <Contrast key={key} data={section} ground={ground} />;
    case 'worth':
      return <Worth key={key} data={section} ground={ground} />;
    case 'outcomes':
      return <Outcomes key={key} data={section} ground={ground} />;
    case 'testimonial':
      return <Testimonial key={key} data={section} ground={ground} />;
    case 'reportPreview':
      return <ReportPreview key={key} data={section} ground={ground} />;
    case 'steps':
      return <Steps key={key} data={section} ground={ground} />;
    case 'counsellor':
      return <Counsellor key={key} data={section} ground={ground} />;
    case 'kit':
      return <Kit key={key} data={section} ground={ground} />;
    case 'trust':
      return <Trust key={key} data={section} ground={ground} />;
    case 'faqs':
      return <Faqs key={key} data={section} ground={ground} />;
    case 'finalCta':
      return <FinalCta key={key} data={section} ground={ground} />;
    case 'disclaimer':
      return <Disclaimer key={key} data={section} />;
    case 'footer':
      return <Footer key={key} data={section} />;
    default: {
      // Exhaustiveness guard - see the note above.
      const _never: never = section;
      return _never;
    }
  }
}

export default function TestPageView({ test }: { test: TestPage }) {
  return (
    <div className="kyg-tests bg-linenw">
      <ScrollProgress />
      <RevealRoot>{test.sections.map((s, i) => renderSection(s, i))}</RevealRoot>
    </div>
  );
}
