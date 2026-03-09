import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';

const Portfolio = dynamic(() => import('@/components/Portfolio'), { ssr: false });

export default function Home() {
  return (
    <ErrorBoundary>
      <Portfolio />
    </ErrorBoundary>
  );
}
