'use client';

// Client-only context wrapper.

import { BookingProvider } from '@/components/site/BookingModal';

export function Providers({ children }) {
  return <BookingProvider>{children}</BookingProvider>;
}
