import React from 'react';
import Shell from '@/components/layout/Shell';
import { useT } from '@/i18n';
import { ButtonLink, Keyboard } from '@/ui';

/**
 * A real 404. The router used to redirect every unknown path to the home page,
 * which quietly hid broken links from everyone who could have fixed them.
 */
const NotFoundPage: React.FC = () => {
  const { t } = useT();

  return (
    <Shell padded={false}>
      <div className="shell py-28 sm:py-36 text-center">
        {/* A keyboard with a gap in it, which is what a missing page is. */}
        <div
          aria-hidden
          className="mx-auto mb-12 max-w-md flex items-end gap-6"
        >
          <Keyboard lowestMidi={60} highestMidi={64} height={72} decorative tone="shadow" />
          <Keyboard lowestMidi={69} highestMidi={72} height={72} decorative tone="shadow" />
        </div>

        <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-semibold">
          {t('state.notFound')}
        </h1>
        <p className="mt-5 mx-auto max-w-md text-[15px] leading-relaxed text-ink-mid">
          {t('state.notFoundBody')}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/" tone="right" size="md">
            {t('state.goHome')}
          </ButtonLink>
          <ButtonLink to="/midi" tone="quiet" size="md">
            {t('nav.catalog')}
          </ButtonLink>
        </div>
      </div>
    </Shell>
  );
};

export default NotFoundPage;
