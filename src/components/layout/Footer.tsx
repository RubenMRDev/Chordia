import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '@/i18n';
import { Keyboard } from '@/ui';
import BrandMark from './BrandMark';

/**
 * The close of every page. The licence line is not boilerplate here: the whole
 * catalogue exists because those pieces are public domain or CC, and the
 * sources have to be credited.
 */
interface FooterProps {
  /**
   * The keyboard strip along the top edge. Turned off on pages that already
   * close on a keyboard of their own, so the device does not appear twice in a
   * row and stop reading as a device at all.
   */
  showKeys?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showKeys = true }) => {
  const { t } = useT();

  return (
    <footer
      className={`relative border-t border-[var(--edge)] bg-ground-0 ${
        // With its own keyboard the footer wants air above it; without one the
        // page already ended on an instrument, so it butts straight up to it.
        showKeys ? 'mt-24' : 'mt-0'
      }`}
    >
      {showKeys && (
      <Keyboard
        lowestMidi={36}
        highestMidi={72}
        height={22}
        decorative
        tone="shadow"
        className="absolute -top-[11px] left-0 right-0 opacity-70"
      />
      )}

      <div className="shell pt-16 pb-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <BrandMark size={20} />
              <span className="font-display text-[17px] font-semibold">
                Chordia
              </span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-low">
              {t('footer.licence')}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-low">
              {t('home.catalog.sources')}
            </p>
          </div>

          <nav aria-label={t('footer.product')} className="shrink-0">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
              {t('footer.product')}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 list-none p-0 m-0">
              {[
                { to: '/midi', label: t('nav.catalog') },
                { to: '/discover', label: t('nav.discover') },
                // /demo is the guided tour of the chord editor, not the player.
                { to: '/demo', label: t('nav.tryEditor') },
                { to: '/register', label: t('nav.signUp') },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-mid no-underline hover:text-ink transition-colors duration-[var(--t-quick)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="numeric mt-12 pt-6 border-t border-[var(--edge)] text-[13px] text-ink-low">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
