import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useLoaders } from "../client"
import { config } from "../query-config"

/**
 * Returns a query for a simplified album object from the Spotify API. This will
 * leverage the cache better than `useFullAlbum` if used in combination with
 * fetching Playlists, Artists etc which fetches simplified album data already.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-album
 * @param id Spotify album ID
 */
export function useSimplifiedAlbum(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.AlbumObjectSimplified, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { album } = useLoaders()
  return useQuery({
    queryKey: ["album", "simplified", id],
    queryFn: () => album.load(id),
    ...config(options),
  })
}

/**
 * Returns a query for a full album object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-album
 * @param id Spotify album ID
 */
export function useFullAlbum(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.AlbumObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { album } = useLoaders()
  return useQuery({
    queryKey: ["album", "full", id],
    queryFn: () => album.load(id),
    ...config(options),
  })
}
