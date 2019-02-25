import { Artist as RecentArtist } from './types/spotify-recent';
import { Artist } from './types/spotify-top-tracks';

export const generateArtistString = (artists: Artist[] | RecentArtist[]) => {
  if (artists.length === 1) {
    return artists[0].name;
  }

  const additionalArtists =
    artists
      .slice(1, artists.length > 2 ? -1 : undefined)
      .map(a => a.name)
      .join(', ') +
    (artists.length > 2 ? ` and ${artists[artists.length - 1].name}` : '');

  return `${artists[0].name} feat. ${additionalArtists}`;
};
