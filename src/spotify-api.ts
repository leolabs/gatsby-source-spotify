import fetch from 'node-fetch';

import { Playlist, PlaylistsResponse } from './types/spotify-playlists';
import { TokenResponse } from './types/spotify-token';
import { Artist, TopArtistsResponse } from './types/spotify-top-artists';
import { TopTracksResponse, Track } from './types/spotify-top-tracks';

export type Scope =
  | 'playlist-read-private'
  | 'user-modify-playback-state'
  | 'user-top-read'
  | 'user-read-recently-played'
  | 'user-read-currently-playing'
  | 'playlist-modify-private'
  | 'app-remote-control'
  | 'playlist-modify-public'
  | 'user-read-birthdate'
  | 'user-read-playback-state'
  | 'user-follow-read'
  | 'user-read-email'
  | 'streaming'
  | 'playlist-read-collaborative'
  | 'user-library-modify'
  | 'user-read-private'
  | 'user-follow-modify'
  | 'user-library-read';

export type TimeRange = 'long_term' | 'medium_term' | 'short_term';

export const SPOTIFY_ACCOUNT_URL = 'https://accounts.spotify.com';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
export const REDIRECT_URL = 'http://localhost:5071/spotify';

export const generateAuthUrl = (
  clientId: string,
  scopes: Scope[] = ['user-top-read'],
) => {
  const base = new URL(`${SPOTIFY_ACCOUNT_URL}/authorize`);
  base.searchParams.append('response_type', 'code');
  base.searchParams.append('redirect_uri', REDIRECT_URL);
  base.searchParams.append('client_id', clientId);
  base.searchParams.append('scope', scopes.join(' '));
  return String(base);
};

export const getTokens = async (
  clientId: string,
  clientSecret: string,
  code: string,
  grantType: 'authorization_code' | 'refresh_token',
) => {
  const body = new URLSearchParams();

  body.append('grant_type', grantType);
  body.append('redirect_uri', REDIRECT_URL);
  body.append(grantType === 'refresh_token' ? 'refresh_token' : 'code', code);
  body.append('client_id', clientId);
  body.append('client_secret', clientSecret);

  const response = await fetch(`${SPOTIFY_ACCOUNT_URL}/api/token`, {
    method: 'POST',
    body: body as any, // Typing seems to be off here
  });

  if (!response.ok) {
    throw new Error(`${response.statusText}: ${await response.text()}`);
  }

  return (await response.json()) as TokenResponse;
};

const getTop = async (
  accessToken: string,
  type: 'artists' | 'tracks',
  timeRange: TimeRange = 'medium_term',
  limit: number = 20,
) => {
  const url = new URL(`${SPOTIFY_API_URL}/me/top/${type}`);
  url.searchParams.append('time_range', timeRange);
  url.searchParams.append('limit', String(Math.min(limit, 50)));

  const response = await fetch(String(url), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `[${url} / ${accessToken}] ${
        response.statusText
      }: ${await response.text()}`,
    );
  }

  const result: TopArtistsResponse | TopTracksResponse = await response.json();
  return result.items;
};

export const getPlaylists = async (accessToken: string, limit: number = 50) => {
  const url = new URL(`${SPOTIFY_API_URL}/me/playlists`);
  url.searchParams.append('limit', String(Math.min(limit, 50)));

  const response = await fetch(String(url), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.statusText}: ${await response.text()}`);
  }

  const result: PlaylistsResponse = await response.json();
  return result.items;
};

export const getUserData = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  timeRanges: TimeRange[] = ['short_term', 'medium_term', 'long_term'],
  fetchPlaylists: boolean = true,
) => {
  const { access_token } = await getTokens(
    clientId,
    clientSecret,
    refreshToken,
    'refresh_token',
  );

  const playlists = fetchPlaylists ? await getPlaylists(access_token) : [];

  const artists = await Promise.all(
    timeRanges.map(async t => {
      const artists = (await getTop(access_token, 'artists', t)) as Artist[];
      return artists.map(artist => ({ ...artist, time_range: t }));
    }),
  );

  const tracks = await Promise.all(
    timeRanges.map(async t => {
      const tracks = (await getTop(access_token, 'tracks', t)) as Track[];
      return tracks.map(track => ({ ...track, time_range: t }));
    }),
  );

  return {
    playlists,
    artists: [].concat(...artists) as (Artist & { time_range: TimeRange })[],
    tracks: [].concat(...tracks) as (Track & { time_range: TimeRange })[],
  };
};
