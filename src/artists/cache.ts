import { QueryClient } from "@tanstack/react-query"

export function addArtistsToCache(
  client: QueryClient,
  artists: SpotifyApi.ArtistObjectSimplified[] | SpotifyApi.ArtistObjectFull[]
) {
  for (const artist of artists) {
    if ("genres" in artist) {
      client.setQueryData(["artist", "full", artist.id], artist)
    }
    client.setQueryData(["artist", "simplified", artist.id], artist)
  }
}
