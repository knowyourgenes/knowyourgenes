import type { Metadata } from 'next';
import SwaggerViewer from './SwaggerViewer';

export const metadata: Metadata = {
  title: 'KYG API docs',
  robots: { index: false, follow: false },
};

export default function ApiDocsPage() {
  return <SwaggerViewer />;
}
