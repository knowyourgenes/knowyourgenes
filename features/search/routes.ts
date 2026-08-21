/** Where the results page lives. One constant so nothing hardcodes the path. */
export const SEARCH_PATH = '/search';

/**
 * URL for a search. Returns the bare path for an empty query rather than
 * `/search?q=` - a trailing empty param is a different URL to a crawler and to
 * the browser's history, for no difference in what is rendered.
 */
export function searchHref(query: string): string {
  const q = query.trim();
  return q ? `${SEARCH_PATH}?q=${encodeURIComponent(q)}` : SEARCH_PATH;
}
