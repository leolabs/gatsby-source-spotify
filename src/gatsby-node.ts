import { createRemoteFileNode } from 'gatsby-source-filesystem';

import { generateArtistString } from './artist-list';
import { PlaylistNode, TopArtistNode, TopTrackNode } from './nodes';
import { getUserData, TimeRange } from './spotify-api';

interface PluginOptions {
  // Auth
  clientId: string;
  clientSecret: string;
  refreshToken: string;

  // Config
  timeRanges?: TimeRange[];
  fetchPlaylists?: boolean;
}

const referenceRemoteFile = async (
  url: string,
  { cache, createNode, createNodeId, touchNode, store },
) => {
  const cachedResult = await cache.get(url);

  if (cachedResult) {
    touchNode({ nodeId: cachedResult });
    return { localFile___NODE: cachedResult };
  }

  const fileNode = await createRemoteFileNode({
    url,
    store,
    cache,
    createNode,
    createNodeId,
    ext: !url.includes('.') ? '.jpg' : undefined,
  });

  if (fileNode) {
    cache.set(url, fileNode.id);
    return { localFile___NODE: fileNode.id };
  }

  return null;
};

export const sourceNodes = async (
  { actions, createNodeId, store, cache },
  pluginOptions: PluginOptions,
) => {
  const { createNode, touchNode } = actions;
  const helpers = { cache, createNode, createNodeId, store, touchNode };

  const { tracks, artists, playlists } = await getUserData(
    pluginOptions.clientId,
    pluginOptions.clientSecret,
    pluginOptions.refreshToken,
    pluginOptions.timeRanges,
    pluginOptions.fetchPlaylists,
  );

  await Promise.all([
    ...tracks.map(async (track, index) => {
      createNode(
        TopTrackNode({
          ...track,
          id: `${track.time_range}__${track.id}`,
          order: index,
          artistString: generateArtistString(track.artists),
          image:
            track.album && track.album.images && track.album.images.length
              ? await referenceRemoteFile(track.album.images[0].url, helpers)
              : null,
        }),
      );
    }),
    ...artists.map(async (artist, index) => {
      createNode(
        TopArtistNode({
          ...artist,
          id: `${artist.time_range}__${artist.id}`,
          order: index,
          image:
            artist.images && artist.images.length
              ? await referenceRemoteFile(artist.images[0].url, helpers)
              : null,
        }),
      );
    }),
    ...playlists.map(async (playlist, index) => {
      createNode(
        PlaylistNode({
          ...playlist,
          order: index,
          image:
            playlist.images && playlist.images.length
              ? await referenceRemoteFile(playlist.images[0].url, helpers)
              : null,
        }),
      );
    }),
  ]);

  return;
};
