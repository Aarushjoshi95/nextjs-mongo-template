'use client';

// Client-only context wrapper. QueryClient is created once at module load.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookingProvider } from '@/components/site/BookingModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }) {
  return <QueryClientProvider client={queryClient}><BookingProvider>{children}</BookingProvider></QueryClientProvider>;
}
