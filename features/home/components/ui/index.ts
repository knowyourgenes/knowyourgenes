// The homepage's surface. The five primitives it draws with now live in
// components/shared/kyg - the contact page draws with the same ones - and are
// re-exported here so every section keeps importing from `../ui` unchanged.
// What is genuinely homepage-only (its photography, its section-internal
// spacing) still lives beside this file in ./tokens.
export { Section, Button, Rule, SectionTitle, Eyebrow, Heading, Lead, Icon, IconWell } from '@/components/shared/kyg';
export type { ButtonVariant, IconName, Ground } from '@/components/shared/kyg';
export { GROUND, PIN_PANE, PIN_TRACK, RULE_DARK, RULE_LIGHT, SECTION_Y, isDark } from '@/components/shared/kyg';
export { HEAD_GAP, MEDIA_CAP, PHOTO } from './tokens';
