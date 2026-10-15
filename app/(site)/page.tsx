import type { Metadata } from 'next';
import Blocks from '@/components/sections/Blocks';
import { getPage } from '@/lib/content';

// The homepage is the block list in content/pages/home.mdx. Title and description
// fall back to the site defaults built from config/site.
export function generateMetadata(): Metadata {
  const { title, description } = getPage('home');
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: { canonical: '/' },
  };
}

export default function HomePage() {
  return <Blocks blocks={getPage('home').blocks} />;
}
