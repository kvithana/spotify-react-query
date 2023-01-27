import { QueryClient } from "@tanstack/react-query"

export function addTracksToCache(client: QueryClient, tracks: SpotifyApi.TrackObjectSimplified[] | SpotifyApi.TrackObjectFull[]) {
  for (const track of tracks) {
    if ('album' in track) {
      client.setQueryData(["album", "simplified", track.album.id], track.album)
      for (const artist of track.artists) {
      client.setQueryData(["artist", "simplified", artist.id], artist)
      }
      client.setQueryData(["track", "full", track.id], track)
    }
    client.setQueryData(["track", "simplified", track.id], track)
  }
}
