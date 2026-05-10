import type {
  PlaylistTracksOptions,
  RecentlyPlayedOptions,
  SpotifyClient,
  SpotifyResponse,
  TopItemsOptions,
} from "./types"

export interface CreateSpotifyClientOptions {
  /**
   * Returns the current OAuth access token, or `undefined` if no token is yet
   * available. The library will poll this getter (via `until`) before issuing
   * any request, so it is safe to set the token asynchronously.
   */
  getAccessToken: () => string | undefined
  /**
   * Override the base URL used for all requests. Defaults to the public Spotify
   * Web API host. Useful for testing or for routing through a proxy.
   */
  baseUrl?: string
  /**
   * Override the global `fetch`. Allows injecting a polyfill or wrapping the
   * default implementation to add interceptors, retries, etc.
   */
  fetch?: typeof fetch
}

const DEFAULT_BASE_URL = "https://api.spotify.com/v1"

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.append(key, String(value))
    }
  }
  const stringified = search.toString()
  return stringified.length > 0 ? `?${stringified}` : ""
}

/**
 * Lightweight, dependency-free Spotify Web API client built on the native
 * `fetch` API. Implements only the endpoints consumed by `spotify-react-query`
 * — sufficient to back every hook in this package without pulling in
 * `spotify-web-api-node` (and its Node-only transitive dependencies).
 *
 * Bring your own access-token state. The returned client mirrors the shape of
 * the methods used from `SpotifyWebApi`, so it can be passed directly to
 * `<SpotifyQueryProvider />` as the `spotify` prop.
 */
export function createSpotifyClient(options: CreateSpotifyClientOptions): SpotifyClient {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  const fetchImpl = options.fetch ?? fetch

  async function request<T>(path: string, query?: Record<string, string | number | undefined>): Promise<SpotifyResponse<T>> {
    const token = options.getAccessToken()
    const headers: Record<string, string> = {
      Accept: "application/json",
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetchImpl(`${baseUrl}${path}${query ? buildQuery(query) : ""}`, {
      method: "GET",
      headers,
    })

    // Spotify returns 204 No Content for some endpoints; everything else is JSON.
    let body: any = null
    if (response.status !== 204) {
      const text = await response.text()
      if (text.length > 0) {
        try {
          body = JSON.parse(text)
        } catch {
          body = text
        }
      }
    }

    return { statusCode: response.status, body: body as T }
  }

  return {
    getAccessToken() {
      return options.getAccessToken()
    },

    getTracks(ids) {
      return request<SpotifyApi.MultipleTracksResponse>("/tracks", { ids: ids.join(",") })
    },

    getAlbums(ids) {
      return request<SpotifyApi.MultipleAlbumsResponse>("/albums", { ids: ids.join(",") })
    },

    getArtists(ids) {
      return request<SpotifyApi.MultipleArtistsResponse>("/artists", { ids: ids.join(",") })
    },

    getPlaylist(id) {
      return request<SpotifyApi.SinglePlaylistResponse>(`/playlists/${encodeURIComponent(id)}`)
    },

    getPlaylistTracks(id, opts: PlaylistTracksOptions = {}) {
      return request<SpotifyApi.PlaylistTrackResponse>(`/playlists/${encodeURIComponent(id)}/tracks`, {
        fields: opts.fields,
        limit: opts.limit,
        offset: opts.offset,
        market: opts.market,
      })
    },

    getMyTopTracks(opts: TopItemsOptions = {}) {
      return request<SpotifyApi.UsersTopTracksResponse>("/me/top/tracks", {
        limit: opts.limit,
        offset: opts.offset,
        time_range: opts.time_range,
      })
    },

    getMyTopArtists(opts: TopItemsOptions = {}) {
      return request<SpotifyApi.UsersTopArtistsResponse>("/me/top/artists", {
        limit: opts.limit,
        offset: opts.offset,
        time_range: opts.time_range,
      })
    },

    getMyRecentlyPlayedTracks(opts: RecentlyPlayedOptions = {}) {
      return request<SpotifyApi.UsersRecentlyPlayedTracksResponse>("/me/player/recently-played", {
        after: opts.after,
        before: opts.before,
        limit: opts.limit,
      })
    },
  }
}
