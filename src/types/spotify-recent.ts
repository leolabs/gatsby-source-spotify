export interface RecentResponse {
  items: Item[];
  next: string;
  cursors: Cursors;
  limit: number;
  href: string;
}

export interface Cursors {
  after: string;
  before: string;
}

export interface Item {
  track: Track;
  played_at: Date;
  context: Context | null;
}

export interface Context {
  uri: string;
  external_urls: ExternalUrls;
  href: string;
  type: AlbumTypeEnum;
}

export interface ExternalUrls {
  spotify: string;
}

export enum AlbumTypeEnum {
  Album = 'album',
  Compilation = 'compilation',
  Single = 'single',
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
}

export interface Album {
  album_type: AlbumTypeEnum;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: Date;
  release_date_precision: string;
  total_tracks: number;
  type: AlbumTypeEnum;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface ExternalIDS {
  isrc: string;
}
