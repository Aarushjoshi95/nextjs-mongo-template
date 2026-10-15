import type { ReactNode } from 'react';
import AnnouncementBar from '@/components/site/AnnouncementBar';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { site } from '@/config/site';

// Site chrome, rendered once for every page in the (site) group.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {site.announcement && <AnnouncementBar {...site.announcement} />}
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
