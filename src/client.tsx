import { type QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { createContext, useMemo } from "react"
import { type AlbumLoader, createAlbumLoader } from "./albums/loader"
import { type ArtistLoader, createArtistLoader } from "./artists/loader"
import { createTrackLoader, type TrackLoader } from "./tracks/loader"
import type { SpotifyClient } from "./types"

export type SpotifyQueryContextType = {
  client: SpotifyClient
  loaders: {
    track: TrackLoader
    album: AlbumLoader
    artist: ArtistLoader
  }
}

export const SpotifyQueryContext = createContext<SpotifyQueryContextType | null>(null)

export function SpotifyQueryProvider({
  query,
  spotify,
  children,
}: {
  query: QueryClient
  spotify: SpotifyClient
  children: React.ReactNode
}) {
  const loaders = useMemo(
    () => ({
      track: createTrackLoader(spotify),
      album: createAlbumLoader(spotify, query),
      artist: createArtistLoader(spotify),
    }),
    [spotify, query],
  )

  const value = useMemo(
    () => ({
      client: spotify,
      loaders,
    }),
    [spotify, loaders],
  )

  return (
    <SpotifyQueryContext.Provider value={value}>
      <QueryClientProvider client={query}>{children}</QueryClientProvider>
    </SpotifyQueryContext.Provider>
  )
}

export function useLoaders() {
  const context = React.useContext(SpotifyQueryContext)
  if (!context) {
    throw new Error("`useLoaders` must be used within a `<SpotifyQueryProvider />`")
  }
  return context.loaders
}

export function useSpotifyClient() {
  const context = React.useContext(SpotifyQueryContext)
  if (!context) {
    throw new Error("`useSpotifyClient` must be used within a `<SpotifyQueryProvider />`")
  }
  return context.client
}
