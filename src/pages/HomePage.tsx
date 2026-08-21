import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroInstrument from '@/components/home/HeroInstrument';
import PianoPicker from '@/components/home/PianoPicker';
import PracticeDemo from '@/components/home/PracticeDemo';
import ProgressionShowcase from '@/components/home/ProgressionShowcase';
import {
  CATALOG_COMPOSERS,
  CATALOG_TOTAL,
  DIFFICULTY_BANDS,
  TOP_COMPOSERS,
  TOP_STYLES,
} from '@/features/midi/catalogStats';
import { useT, type MessageKey } from '@/i18n';
import { Link } from 'react-router-dom';
import { ButtonLink, Keyboard, SectionHeading } from '@/ui';

/** The two hands, named in the product's own colours. */
const HandLegend: React.FC = () => {
  const { t } = useT();
  return (
    <ul className="flex items-center gap-5 list-none m-0 p-0">
      {(
        [
          ['left', 'var(--color-hand-left)', t('hand.left')],
          ['right', 'var(--color-hand-right)', t('hand.right')],
        ] as const
      ).map(([key, colour, label]) => (
        <li key={key} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ background: colour }}
          />
          <span className="text-[13px] font-medium text-ink-mid">{label}</span>
        </li>
      ))}
    </ul>
  );
};

const HomePage: React.FC = () => {
  const { t, tn } = useT();

  return (
    <div className="min-h-screen flex flex-col bg-ground-1">
      <Header />

      <main id="main" className="flex-1">
        {/*
          FIRST VIEWPORT — the instrument, at the scale it has in life. The real
          renderer runs the bundled demo behind the type, and its keyboard is
          playable. No stock photograph, no headline over a gradient.
        */}
        <section className="relative overflow-hidden bg-ground-0 min-h-[max(560px,82svh)] flex flex-col">
          <div className="absolute inset-0">
            <HeroInstrument />
          </div>

          {/*
            The type sits in the dark air between the falling notes and the
            keys, so notes pass behind it. The scrim is vertical and only as
            strong as the text needs.
          */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[68%] pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--color-ground-0) 92%, transparent) 0%, color-mix(in srgb, var(--color-ground-0) 62%, transparent) 46%, transparent 100%)',
            }}
          />

          <div className="relative shell pt-14 sm:pt-20 pb-8 pointer-events-none">
            <div className="max-w-[46rem]">
              <h1 className="font-display text-[clamp(2.5rem,7.5vw,5rem)] font-semibold leading-[0.98]">
                {t('home.title')}
              </h1>
              <p className="mt-6 text-[clamp(1rem,1.6vw,1.25rem)] leading-relaxed text-ink-mid prose-measure">
                {t('home.lede')}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3 pointer-events-auto">
                <ButtonLink to="/register" tone="right" size="lg">
                  {t('home.ctaPrimary')}
                </ButtonLink>
                <ButtonLink to="/midi" tone="quiet" size="lg">
                  {t('home.ctaSecondary')}
                </ButtonLink>
              </div>

              <div className="mt-8">
                <HandLegend />
              </div>
            </div>
          </div>

          {/* What is sounding, named. Sits clear of the keys. */}
          <div className="relative shell mt-auto pb-[26vh] sm:pb-[22vh] pointer-events-none">
            <div className="inline-flex items-center gap-3 rounded-md border border-[var(--edge)] bg-[color-mix(in_srgb,var(--color-ground-0)_78%,transparent)] px-3.5 py-2 backdrop-blur-sm">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-hand-right sustain"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low whitespace-nowrap">
                {t('home.nowPlaying')}
              </span>
              <span className="text-[13px] font-medium text-ink whitespace-nowrap">
                {t('home.demoPiece')}
              </span>
              {/* The attribution is the first thing to go when there is no room. */}
              <span className="hidden sm:inline text-[13px] text-ink-low whitespace-nowrap">
                {t('home.demoComposer')}
              </span>
            </div>
          </div>
        </section>

        {/*
          COMPOSE — the half of the product the page used to omit entirely.
          Chordia is a place to write chord progressions first; the play-along
          is what you do with them afterwards.
        */}
        <section className="shell py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20 lg:items-center">
            <div>
              <SectionHeading
                title={t('home.compose.title')}
                body={t('home.compose.body')}
              />
              <dl className="mt-9 m-0">
                {(
                  [
                    ['home.compose.circle', 'home.compose.circleNote'],
                    ['home.compose.meta', 'home.compose.metaNote'],
                    ['home.compose.ai', 'home.compose.aiNote'],
                  ] as const
                ).map(([label, note]) => (
                  <div
                    key={label}
                    className="py-4 border-t border-[var(--edge)]"
                  >
                    <dt className="text-sm font-semibold text-ink">
                      {t(label)}
                    </dt>
                    <dd className="m-0 mt-1 text-[13px] leading-relaxed text-ink-low">
                      {t(note)}
                    </dd>
                  </div>
                ))}
              </dl>
              <ButtonLink
                to="/create"
                tone="right"
                size="md"
                className="mt-8"
              >
                {t('home.compose.cta')}
              </ButtonLink>
            </div>
            <ProgressionShowcase />
          </div>
        </section>

        {/*
          THE NETWORK — your library, everyone else's songs, and the profiles
          behind them. Three named surfaces on hairlines, one per column.
        */}
        <section className="border-y border-[var(--edge)] bg-ground-2">
          <div className="shell py-24 sm:py-32">
            <div className="max-w-2xl">
              <SectionHeading
                title={t('home.network.title')}
                body={t('home.network.body')}
              />
            </div>
            <dl className="mt-12 m-0 grid sm:grid-cols-3 sm:gap-x-12">
              {(
                [
                  ['home.network.library', 'home.network.libraryNote', '/library'],
                  ['home.network.discover', 'home.network.discoverNote', '/discover'],
                  ['home.network.profile', 'home.network.profileNote', '/profile'],
                ] as const
              ).map(([label, note, to]) => (
                <div
                  key={label}
                  className="py-5 border-t border-[var(--seam)] sm:border-t-2"
                >
                  <dt className="text-[15px] font-semibold">
                    <Link
                      to={to}
                      className="text-ink no-underline hover:text-hand-right transition-colors duration-[var(--t-quick)]"
                    >
                      {t(label)}
                    </Link>
                  </dt>
                  <dd className="m-0 mt-2 text-[13px] leading-relaxed text-ink-mid">
                    {t(note)}
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink to="/discover" tone="quiet" size="md" className="mt-10">
              {t('home.network.cta')}
            </ButtonLink>
          </div>
        </section>

        {/*
          YOUR PIANO — a split: the claim on the left, the demonstration on the
          right, and the demonstration is the real presets.
        */}
        <section className="shell py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20 lg:items-start">
            <SectionHeading
              title={t('home.piano.title')}
              body={t('home.piano.body')}
            />
            <PianoPicker />
          </div>
        </section>

        {/*
          THE CATALOGUE — a real index, dense and measured. Deliberately not
          three feature cards: a catalogue's own form is a list with counts.
        */}
        <section className="shell py-24 sm:py-32">
          <div className="max-w-3xl">
            <SectionHeading
              title={t('home.catalog.title')}
              body={t('home.catalog.body')}
            />
          </div>

            <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <ol className="list-none m-0 p-0 columns-1 sm:columns-2 gap-x-14">
                {TOP_COMPOSERS.map((composer) => (
                  <li
                    key={composer.name}
                    className="flex items-baseline gap-3 py-2.5 border-b border-[var(--edge)] break-inside-avoid"
                  >
                    <span className="text-[15px] text-ink truncate">
                      {composer.name}
                    </span>
                    <span
                      aria-hidden
                      className="flex-1 border-b border-dotted border-[var(--edge)] translate-y-[-3px]"
                    />
                    <span className="numeric text-[15px] font-semibold text-ink-mid tabular-nums">
                      {composer.pieces}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-8">
                <div>
                  <div className="numeric font-display text-[3.5rem] leading-[0.9] text-hand-right">
                    {CATALOG_TOTAL}
                  </div>
                  <p className="mt-2.5 text-sm text-ink">
                    {t('home.catalog.pieces')}
                    <span className="text-ink-low"> · </span>
                    {tn('catalog.composers', CATALOG_COMPOSERS)}
                  </p>
                </div>

                <dl className="m-0">
                  {TOP_STYLES.map((style) => (
                    <div
                      key={style.name}
                      className="flex items-center justify-between gap-4 py-1.5"
                    >
                      <dt className="text-[13px] text-ink-mid">
                        {t(`style.${style.name}` as MessageKey)}
                      </dt>
                      <dd className="numeric m-0 text-[13px] text-ink-low tabular-nums">
                        {style.pieces}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="text-[13px] leading-relaxed text-ink-low">
                  {t('catalog.difficulty')}: 1–{DIFFICULTY_BANDS}
                </p>

                <ButtonLink to="/midi" tone="quiet" size="md">
                  {t('home.catalog.browse')}
                </ButtonLink>
              </div>
            </div>
        </section>

        {/*
          PRACTICE MODE — the quiet passage after the dense one, and the only
          section where the visitor is asked to do something.
        */}
        <section className="shell py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20 lg:items-center">
            <div>
              <SectionHeading
                title={t('home.practice.title')}
                body={t('home.practice.body')}
              />
              <dl className="mt-9 m-0">
                {(
                  [
                    ['home.practice.listen', 'home.practice.listenBody'],
                    ['home.practice.practice', 'home.practice.practiceBody'],
                  ] as const
                ).map(([title, body]) => (
                  <div
                    key={title}
                    className="py-4 border-t border-[var(--edge)]"
                  >
                    <dt className="text-sm font-semibold text-ink">
                      {t(title)}
                    </dt>
                    <dd className="m-0 mt-1 text-[13px] leading-relaxed text-ink-low">
                      {t(body)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <PracticeDemo />
          </div>
        </section>

        {/*
          THE ENGINE — measurement. Two figures and two named behaviours, in a
          definition list rather than four matching tiles.
        */}
        <section className="border-y border-[var(--edge)] bg-ground-2">
          <div className="shell py-24 sm:py-32">
            <div className="max-w-2xl">
              <SectionHeading
                title={t('home.engine.title')}
                body={t('home.engine.body')}
              />
            </div>

            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ['31', 'home.engine.samples', 'home.engine.samplesNote'],
                  ['48', 'home.engine.voices', 'home.engine.voicesNote'],
                ] as const
              ).map(([figure, label, note]) => (
                <div key={label}>
                  <div className="numeric font-display text-[3.25rem] leading-[0.9] text-ink">
                    {figure}
                  </div>
                  <p className="mt-2.5 text-sm font-semibold text-ink">
                    {t(label)}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-low">
                    {t(note)}
                  </p>
                </div>
              ))}

              {(
                [
                  ['home.engine.pedal', 'home.engine.pedalNote'],
                  ['home.engine.spread', 'home.engine.spreadNote'],
                ] as const
              ).map(([label, note]) => (
                <div key={label} className="sm:pt-[3.6rem]">
                  <p className="text-sm font-semibold text-ink">{t(label)}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-low">
                    {t(note)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
          INPUT — a short, plain band. Three rows of text on hairlines, not
          three boxes with icons in them.
        */}
        <section className="shell py-24 sm:py-28">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold">
            {t('home.input.title')}
          </h2>
          <dl className="mt-10 m-0 grid gap-y-0 sm:grid-cols-3 sm:gap-x-12">
            {(
              [
                ['home.input.midi', 'home.input.midiBody'],
                ['home.input.keyboard', 'home.input.keyboardBody'],
                ['home.input.mouse', 'home.input.mouseBody'],
              ] as const
            ).map(([label, body]) => (
              <div
                key={label}
                className="py-5 border-t border-[var(--seam)] sm:border-t-2"
              >
                <dt className="text-[15px] font-semibold text-ink">
                  {t(label)}
                </dt>
                <dd className="m-0 mt-2 text-[13px] leading-relaxed text-ink-mid">
                  {t(body)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/*
          CLOSE — anchored by the instrument again, at full width, so the page
          ends where it began.
        */}
        <section className="relative overflow-hidden bg-ground-0 border-t border-[var(--edge)]">
          <div className="shell pt-24 pb-0 sm:pt-32 text-center">
            <h2 className="font-display text-[clamp(1.9rem,5vw,3.25rem)] font-semibold leading-[1.02] max-w-3xl mx-auto">
              {t('home.close.title')}
            </h2>
            <p className="mt-6 mx-auto max-w-xl text-[17px] leading-relaxed text-ink-mid">
              {t('home.close.body')}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink to="/register" tone="right" size="lg">
                {t('home.close.cta')}
              </ButtonLink>
              <ButtonLink to="/midi" tone="ghost" size="lg">
                {t('home.close.secondary')}
              </ButtonLink>
            </div>
            <p className="numeric mt-8 text-[13px] text-ink-low">
              {tn('catalog.results', CATALOG_TOTAL)}
            </p>
          </div>

          {/*
            The keyboard closes the page: the instrument in shadow with the note
            light spilling along its top edge. It sits outside the measured
            column on purpose, edge to edge, so the page ends on the instrument
            rather than on a slab floating inside the text width.
          */}
          <div className="relative mt-20 -mb-px">
            <div
              aria-hidden
              className="absolute -top-px left-0 right-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-hand-right) 55%, transparent) 35%, color-mix(in srgb, var(--color-hand-right) 55%, transparent) 65%, transparent)',
                boxShadow: '0 0 24px rgba(0,230,118,0.28)',
              }}
            />
            <Keyboard
              lowestMidi={36}
              highestMidi={84}
              height={132}
              decorative
              tone="shadow"
            />
          </div>
        </section>
      </main>

      {/* The close already ends on a keyboard, so the footer skips its own. */}
      <Footer showKeys={false} />
    </div>
  );
};

export default HomePage;
