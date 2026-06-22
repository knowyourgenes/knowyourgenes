import type { Metadata } from 'next';
import BlogIndex from '@/features/blog/components/BlogIndex';
import { getBlogPosts, type BlogListItem } from '@/features/blog';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Journal · Know Your Genes',
  description:
    'Short, science-grounded reads on wellness, genetic literacy, research and the people behind your KYG reports.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;

  // Best-effort: render the page even if Sanity is unreachable / unconfigured.
  let posts: BlogListItem[] = [];
  try {
    posts = await getBlogPosts();
  } catch {
    posts = [];
  }

  return <BlogIndex posts={posts} activeCategory={category} />;
}
