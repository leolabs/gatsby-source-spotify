import { Artist } from './types/spotify-top-tracks';

export const generateArtistString = (artists: Artist[]) => {
  if (artists.length === 1) {
    return artists[0].name;
  }

  return (
    `${artists[0].name} feat. ` +
    artists
      .slice(1)
      .map(a => a.name)
      .join(', ')
  );
};
