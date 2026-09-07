// =============================================================================
// features/blog - the page's own copy and controls, from Figma 343:647
// -----------------------------------------------------------------------------
// ONLY the chrome lives here. Every article - title, excerpt, tag, author, date,
// read time, hero image - comes from Sanity, so the frame's specimen copy
// ("Dr. Ananya Rao", "26 August 2026") is deliberately NOT reproduced: it is
// placeholder standing in for real documents.
// =============================================================================

export const HERO = {
  eyebrow: 'The KYG Journal',
  headline: 'The more you know,',
  turn: 'the better you can ask.',
  lede: 'Short, science-grounded reads on wellness, genetic literacy, research and the people behind your reports.',
} as const;

export const FEED = {
  label: 'BLOGS',
  searchPlaceholder: 'Search articles, topics, questions…',
  sortLabel: 'Sort',
  loadMore: 'Load more articles',
  readMore: 'Read More',
  editorsPick: 'EDITOR’S PICK',
  empty: {
    none: 'New reads are on the way. Check back soon.',
    noneTitle: 'No articles here yet',
    search: 'Nothing matches that search. Try a different word.',
    searchTitle: 'No matches',
  },
} as const;

/**
 * The sort options, and the one place this page departs from the frame.
 *
 * The design's control reads "Most popular". `blogPost` has no view count, no
 * likes and no ranking field (see sanity/schemas/blogPost.ts), so a "most
 * popular" order cannot be computed - it would have to be a lie or an arbitrary
 * shuffle. These three are all backed by fields that actually exist, and
 * `publishedAt` desc is the schema's own default ordering.
 *
 * Adding real popularity means a view counter and a write path on read, which
 * is a data change and does not belong in a visual redesign.
 */
export const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'quickest', label: 'Quickest read' },
] as const;

export type SortValue = (typeof SORTS)[number]['value'];

/** How many cards the feed shows before "Load more" - the frame draws two rows
 *  of three under the featured card. */
export const PAGE_SIZE = 6;
