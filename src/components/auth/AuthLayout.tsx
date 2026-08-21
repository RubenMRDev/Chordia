import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '@/i18n';
import { Keyboard } from '@/ui';
import BrandMark from '@/components/layout/BrandMark';

interface AuthLayoutProps {
  title: string;
  lede: string;
  children: React.ReactNode;
  /** The other page: register from login, and the other way round. */
  footer: React.ReactNode;
}

/**
 * The frame both auth screens share.
 *
 * Two columns on desktop: the form, and beside it the reason to bother. The old
 * pages were a card floating in the middle of an empty viewport that never said
 * what an account was for — which is a poor trade to ask of someone who can
 * already play the catalogue without one.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  lede,
  children,
  footer,
}) => {
  const { t } = useT();

  const perks = [
    ['home.network.library', 'home.network.libraryNote'],
    ['home.network.discover', 'home.network.discoverNote'],
    ['home.network.profile', 'home.network.profileNote'],
  ] as const;

  return (
    <div className="min-h-screen bg-ground-0 flex flex-col">
      <div className="shell pt-6">
        <Link
          to="/"
          className="press inline-flex items-center gap-2 h-9 -ml-2 px-2 rounded-md text-sm text-ink-mid no-underline hover:text-ink hover:bg-ground-2"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 3.5L4.5 7.5l4 4M4.5 7.5H12" />
          </svg>
          {t('auth.back')}
        </Link>
      </div>

      <div className="flex-1 shell w-full py-10 sm:py-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-24 items-start">
          {/* The form. */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 no-underline mb-9"
            >
              <BrandMark size={20} />
              <span className="font-display text-[17px] font-semibold">
                Chordia
              </span>
            </Link>

            <h1 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.05]">
              {title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-mid">
              {lede}
            </p>

            <div className="mt-8">{children}</div>

            <div className="mt-8 pt-6 border-t border-[var(--edge)] text-sm text-ink-mid">
              {footer}
            </div>
          </div>

          {/* Why an account. Hidden on small screens, where the form is the page. */}
          <aside className="hidden lg:block">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
              {t('auth.perksTitle')}
            </h2>
            <dl className="mt-6 m-0 max-w-md">
              {perks.map(([label, note]) => (
                <div key={label} className="py-4 border-t border-[var(--edge)]">
                  <dt className="text-[15px] font-semibold text-ink">
                    {t(label)}
                  </dt>
                  <dd className="m-0 mt-1 text-[13px] leading-relaxed text-ink-low">
                    {t(note)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-md text-[13px] leading-relaxed text-ink-low">
              {t('auth.perksPlay')}
            </p>

            {/* The instrument in shadow, so the screen still belongs to Chordia. */}
            <Keyboard
              lowestMidi={48}
              highestMidi={79}
              height={92}
              decorative
              tone="shadow"
              className="mt-12 max-w-md"
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
