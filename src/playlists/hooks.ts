import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useSpotifyClient } from "../client"

/**
 * Get a playlist owned by a Spotify user.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist
 * @param id Spotify playlist URI
 */
export function usePlaylist(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.PlaylistObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()

  const loader = (id: string) =>
    client.getPlaylist(id).then((res) => {
      if (res.statusCode !== 200) {
        throw new Error(JSON.stringify(res.body))
      }
      return res.body
    })

  return useQuery(["playlist", id], () => loader(id), options)
}

/**
 * Get full details of the items of a playlist owned by a Spotify user.
 * Parameters can be passed into `options.variables`.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks
 * @param id Spotify playlist URI
 */
export function usePlaylistTracks(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.PlaylistTrackObject[], any[]>,
    "queryKey" | "queryFn" | "initialData"
  > & { variables?: { fields?: string; limit?: number; offset?: number; market?: string } }
) {
  const client = useSpotifyClient()

  const loader = (id: string) =>
    client.getPlaylistTracks(id, options?.variables).then((res) => {
      if (res.statusCode !== 200) {
        throw new Error(JSON.stringify(res.body))
      }
      return res.body
    })

  return useQuery(["playlist", id, options?.variables ?? {}], () => loader(id), options)
}
