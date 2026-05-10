/**
 * Minimal client surface required by `spotify-react-query`. This interface is
 * intentionally structural so that any concrete implementation — including a
 * real `SpotifyWebApi` instance from `spotify-web-api-node`, the bundled
 * `createSpotifyClient` (native `fetch`), or a test mock — can be supplied.
 *
 * Only the methods actually used by the hooks/loaders are declared here. This
 * lets the library stay framework- and runtime-agnostic without pulling in any
 * Spotify SDK at runtime.
 */

export interface SpotifyResponse<T> {
  statusCode: number
  body: T
}

export interface PlaylistTracksOptions {
  fields?: string
  limit?: number
  offset?: number
  market?: string
}

export interface TopItemsOptions {
  limit?: number
  offset?: number
  time_range?: "short_term" | "medium_term" | "long_term"
}

export interface RecentlyPlayedOptions {
  after?: number
  before?: number
  limit?: number
}

export interface SpotifyClient {
  getAccessToken(): string | undefined

  getTracks(ids: readonly string[]): Promise<SpotifyResponse<SpotifyApi.MultipleTracksResponse>>
  getAlbums(ids: readonly string[]): Promise<SpotifyResponse<SpotifyApi.MultipleAlbumsResponse>>
  getArtists(ids: readonly string[]): Promise<SpotifyResponse<SpotifyApi.MultipleArtistsResponse>>

  getPlaylist(id: string): Promise<SpotifyResponse<SpotifyApi.SinglePlaylistResponse>>
  getPlaylistTracks(
    id: string,
    options?: PlaylistTracksOptions
  ): Promise<SpotifyResponse<SpotifyApi.PlaylistTrackResponse>>

  getMyTopTracks(options?: TopItemsOptions): Promise<SpotifyResponse<SpotifyApi.UsersTopTracksResponse>>
  getMyTopArtists(options?: TopItemsOptions): Promise<SpotifyResponse<SpotifyApi.UsersTopArtistsResponse>>
  getMyRecentlyPlayedTracks(
    options?: RecentlyPlayedOptions
  ): Promise<SpotifyResponse<SpotifyApi.UsersRecentlyPlayedTracksResponse>>
}
