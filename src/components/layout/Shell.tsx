import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface ShellProps {
  children: React.ReactNode;
  /** The player runs edge to edge and supplies its own close. */
  bare?: boolean;
  /** Wraps the content in the standard measured column. */
  padded?: boolean;
  className?: string;
}

/**
 * The page frame every route shares. It replaces `LandingLayout`, which only
 * set `overflow-x-hidden` and left each page to compose its own header, so the
 * chrome drifted apart from screen to screen.
 */
const Shell: React.FC<ShellProps> = ({
  children,
  bare = false,
  padded = true,
  className = '',
}) => (
  <div className="min-h-screen flex flex-col bg-ground-1">
    <Header />
    <main id="main" className={`flex-1 ${padded ? 'pt-10 pb-16' : ''} ${className}`}>
      {padded ? <div className="shell">{children}</div> : children}
    </main>
    {!bare && <Footer />}
  </div>
);

export default Shell;
