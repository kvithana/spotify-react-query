import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useLoaders } from "../client"

/**
 * Returns a query for a simplified album object from the Spotify API. This will
 * leverage the cache better that `useFullAlbum` if used in combination with
 * fetching Playlists, Artists etc which fetches simplified album data already.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-album
 * @param id Spotify album URI
 */
export function useSimplifiedAlbum(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.AlbumObjectSimplified, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { album } = useLoaders()
  return useQuery(["album", "simplified", id], () => album.load(id), options)
}

/**
 * Returns a query for a full album object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-album
 * @param id Spotify album URI
 */
export function useFullAlbum(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.AlbumObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { album } = useLoaders()
  return useQuery(["album", "full", id], () => album.load(id), options)
}
