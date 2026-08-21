import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SongCard from '../SongCard';
import { LocaleProvider } from '@/i18n';
import type { Song } from '@/types/models';

const song: Song = {
  id: 'song-1',
  userId: 'user-1',
  title: 'Noche de verano',
  tempo: 120,
  key: 'C',
  timeSignature: '4/4',
  createdAt: '2026-03-04T10:00:00.000Z',
  chords: [
    { keys: ['C4', 'E4', 'G4'], selected: false }, // C
    { keys: ['A3', 'C4', 'E4'], selected: false }, // Am
    { keys: ['F3', 'A3', 'C4'], selected: false }, // F
    { keys: ['G3', 'B3', 'D4'], selected: false }, // G
  ],
};

const renderCard = (props: Partial<React.ComponentProps<typeof SongCard>> = {}) =>
  render(
    <MemoryRouter>
      <LocaleProvider>
        <SongCard song={song} {...props} />
      </LocaleProvider>
    </MemoryRouter>,
  );

describe('SongCard', () => {
  it('shows the progression as chord symbols, not raw notes', () => {
    const { container } = renderCard();
    /*
      Scoped to the chord row: "C" is also the song's key in the metadata line,
      so a document-wide query for it is ambiguous by design.
    */
    const chips = [...container.querySelectorAll('span.numeric.rounded')].map(
      (node) => node.textContent,
    );
    expect(chips).toEqual(['C', 'Am', 'F', 'G']);
    // The stored note names must not leak into the UI.
    expect(screen.queryByText(/C4/)).not.toBeInTheDocument();
  });

  it('links to the song and shows its musical metadata', () => {
    renderCard();
    expect(
      screen.getByRole('link', { name: 'Noche de verano' }),
    ).toHaveAttribute('href', '/song/song-1');
    expect(screen.getByText('120 BPM')).toBeInTheDocument();
    expect(screen.getByText('4/4')).toBeInTheDocument();
  });

  it('caps the preview and says how many more there are', () => {
    const many: Song = {
      ...song,
      chords: Array.from({ length: 12 }, () => ({
        keys: ['C4', 'E4', 'G4'],
        selected: false,
      })),
    };
    render(
      <MemoryRouter>
        <LocaleProvider>
          <SongCard song={many} />
        </LocaleProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('+4')).toBeInTheDocument();
  });

  it('handles a song with no chords instead of rendering an empty box', () => {
    const { container } = render(
      <MemoryRouter>
        <LocaleProvider>
          <SongCard song={{ ...song, chords: [] }} />
        </LocaleProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading').textContent).toBe('Noche de verano');
    // No chips, and the face says so rather than sitting blank.
    expect(container.querySelectorAll('span.numeric.rounded')).toHaveLength(0);
    expect(screen.getByText(/no chords saved|sin acordes guardados/i)).toBeInTheDocument();
  });

  it('only offers deletion when a handler is given', () => {
    const { unmount } = renderCard();
    expect(
      screen.queryByRole('button', { name: /Noche de verano/ }),
    ).not.toBeInTheDocument();
    unmount();

    renderCard({ onDelete: () => {} });
    expect(
      screen.getByRole('button', { name: /Noche de verano/ }),
    ).toBeInTheDocument();
  });

  it('shows the author when one is passed', () => {
    renderCard({ author: 'de Ruben' });
    expect(screen.getByText('de Ruben')).toBeInTheDocument();
  });
});
