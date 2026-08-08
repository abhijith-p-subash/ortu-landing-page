import type { ReactNode } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * Chrome shared by every sub-page: the site navbar, a constrained content
 * column, and the footer. Sub-pages are prose-shaped rather than section-shaped,
 * so they get a narrower column than the homepage.
 */
const PageShell = ({ children }: { children: ReactNode }) => (
  <div
    id="top"
    className="min-h-screen custom-scrollbar bg-bg selection:bg-accent/20 selection:text-white"
  >
    <Navbar />
    <main className="pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto">{children}</div>
    </main>
    <Footer />
  </div>
);

export default PageShell;
