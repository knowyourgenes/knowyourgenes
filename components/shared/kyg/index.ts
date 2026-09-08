// =============================================================================
// components/shared/kyg - the page primitives the homepage, /contact and /about
// all draw with.
// -----------------------------------------------------------------------------
//   Section       the band shell - ground, rail and the ONE vertical rhythm
//   SectionTitle  the eyebrow pill, the two-voice heading, the aside alignment
//   Button        the four skins over the site-wide 44px box
//   Rule          the tapered hairline
//   Note          the rule + two-voice aside
//   PageMasthead  the listing hero over a washed-out photograph
//   Toolbar       the listing label + search + sort bar
//   Icon          the glyph set, inline so it inherits currentColor
//
// These lived in features/home/components/ui until the contact page began
// drawing the same bands off the same Figma system. DESIGN.md §7: used by one
// feature, keep it there; used by two, promote it. This is that promotion -
// `Note` joined them when /about drew the same aside seven more times.
// =============================================================================
export { Section } from './Section';
export { Button, type ButtonVariant } from './Button';
export { Rule } from './Rule';
export { Note } from './Note';
export { PageMasthead } from './PageMasthead';
export { Toolbar, type SortOption, type ToolbarSelect } from './Toolbar';
export { SectionTitle, Eyebrow, Heading, Lead } from './SectionTitle';
export { Icon, IconWell, type IconName } from './Icon';
export { GROUND, PIN_PANE, PIN_TRACK, RULE_DARK, RULE_LIGHT, SECTION_Y, isDark, type Ground } from './tokens';
