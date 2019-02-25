import createNodeHelpers from 'gatsby-node-helpers';

const { createNodeFactory } = createNodeHelpers({
  typePrefix: 'Spotify',
});

export const TopArtistNode = createNodeFactory('TopArtist');
export const TopTrackNode = createNodeFactory('TopTrack');
export const PlaylistNode = createNodeFactory('Playlist');
export const RecentTrackNode = createNodeFactory('RecentTrack');
