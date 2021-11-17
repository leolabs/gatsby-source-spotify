import { createFileNodeFromBuffer } from 'gatsby-source-filesystem';
import { createNodeHelpers } from 'gatsby-node-helpers';
import fetch from 'node-fetch';

import { generateArtistString } from './artist-list';
import { getUserData, TimeRange } from './spotify-api';

export interface PluginOptions {
  // Auth
  clientId: string;
  clientSecret: string;
  refreshToken: string;

  // Config
  timeRanges?: TimeRange[];
  fetchPlaylists?: boolean;
  fetchRecent?: boolean;
}

const referenceRemoteFile = async (
  id: string,
  url: string,
  { cache, createNode, createNodeId, touchNode, store },
) => {
  const cachedResult = await cache.get(url);

  if (cachedResult) {
    touchNode({ nodeId: cachedResult });
    return { localFile___NODE: cachedResult };
  }

  const testRes = await fetch(url);

  if (!testRes.ok) {
    console.warn(`[${id}] Image could not be loaded. Skipping...`);
    return null;
  }

  const fileNode = await createFileNodeFromBuffer({
    buffer: await testRes.buffer(),
    store,
    cache,
    createNode,
    createNodeId,
    name: id.replace(/[^a-z0-9]+/gi, '-'),
    ext: '.jpg',
  });

  if (fileNode) {
    cache.set(url, fileNode.id);
    return { localFile___NODE: fileNode.id };
  }

  return null;
};

export const sourceNodes = async (
  { actions, createNodeId, store, cache, createContentDigest },
  pluginOptions: PluginOptions,
) => {
  const { createNodeFactory } = createNodeHelpers({
    typePrefix: 'Spotify',
    createContentDigest,
    createNodeId,
  });

  const TopArtistNode = createNodeFactory('TopArtist');
  const TopTrackNode = createNodeFactory('TopTrack');
  const PlaylistNode = createNodeFactory('Playlist');
  const RecentTrackNode = createNodeFactory('RecentTrack');

  const { createNode, touchNode } = actions;
  const helpers = { cache, createNode, createNodeId, store, touchNode };

  const { tracks, artists, playlists, recentTracks } = await getUserData(
    pluginOptions,
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
              ? await referenceRemoteFile(
                  track.album.uri,
                  track.album.images[0].url,
                  helpers,
                )
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
              ? await referenceRemoteFile(
                  artist.uri,
                  artist.images[0].url,
                  helpers,
                )
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
              ? await referenceRemoteFile(
                  playlist.uri,
                  playlist.images[0].url,
                  helpers,
                )
              : null,
        }),
      );
    }),
    ...recentTracks.map(async (track, index) => {
      createNode(
        RecentTrackNode({
          ...track,
          id: String(track.played_at),
          order: index,
          track: {
            ...track.track,
            artistString: generateArtistString(track.track.artists),
            image:
              track.track.album &&
              track.track.album.images &&
              track.track.album.images.length
                ? await referenceRemoteFile(
                    track.track.uri,
                    track.track.album.images[0].url,
                    helpers,
                  )
                : null,
          },
        }),
      );
    }),
  ]);

  return;
};
