[size-img]: https://img.shields.io/bundlephobia/minzip/spotify-react-query
[latest-img]: https://img.shields.io/npm/v/spotify-react-query

# Spotify React Query

[![Latest][latest-img]](https://www.npmjs.com/package/spotify-react-query)
[![Size][size-img]](https://bundlephobia.com/result?p=spotify-react-query)

Lightweight React Query hooks for the Spotify Web API. Built on [TanStack Query v5](https://tanstack.com/query/v5/docs/framework/react/overview), requests for Spotify resources are automatically cached and deduped. Under the hood, [dataloader](https://github.com/graphql/dataloader) batches related requests to keep API quota usage low.

Used in production by [musictaste.space](https://musictaste.space).

## Requirements

- React `>= 18`
- `@tanstack/react-query` `^5`
- Node `>= 18` (or any modern browser/edge runtime — uses native `fetch`)

## Install

```bash
npm install spotify-react-query @tanstack/react-query
# or
pnpm add spotify-react-query @tanstack/react-query
# or
yarn add spotify-react-query @tanstack/react-query
```

## Usage

To use the hooks, wrap dependent components in a `SpotifyQueryProvider` and pass in:

1. A [React Query](https://tanstack.com/query/v4/docs/quick-start) `QueryClient`.
2. A Spotify client that satisfies the `SpotifyClient` interface exported from this package.

`spotify-react-query` ships a tiny dependency-free `createSpotifyClient` built on the native `fetch` API — recommended for browser, edge, and modern Node runtimes. You can also bring your own implementation (e.g. `spotify-web-api-node`); any object whose method shapes match `SpotifyClient` is accepted.

The library will not issue requests until `getAccessToken()` returns a value, so you can safely mount the provider before your token resolves. Token refreshes are managed by your application outside the provider.

### SpotifyQueryProvider (recommended: built-in fetch client)

```typescript
import { QueryClient } from "@tanstack/react-query"
import { SpotifyQueryProvider, createSpotifyClient } from "spotify-react-query"

const query = new QueryClient()

// Bring your own access-token state (Redux, Zustand, context, etc.).
let accessToken: string | undefined
const spotify = createSpotifyClient({
  getAccessToken: () => accessToken,
})

const App = () => {
  return (
    <SpotifyQueryProvider query={query} spotify={spotify}>
      <DependentComponents />
    </SpotifyQueryProvider>
  )
}
```

### Using `spotify-web-api-node` instead

If you already use `spotify-web-api-node`, pass it directly — it satisfies the `SpotifyClient` interface structurally:

```typescript
import SpotifyWebApi from "spotify-web-api-node"
import { SpotifyQueryProvider } from "spotify-react-query"

const spotify = new SpotifyWebApi()
spotify.setAccessToken("<ACCESS_TOKEN>")

<SpotifyQueryProvider query={query} spotify={spotify}>{/* ... */}</SpotifyQueryProvider>
```

> **Migrating from `<= 0.12.x`:**
>
> - `spotify-web-api-node` is no longer a peer dependency. Switch to `createSpotifyClient` (built-in, native `fetch`) to drop it and its Node-only transitive deps from your bundle. If you specifically need its full SDK, install it explicitly.
> - This release targets `@tanstack/react-query` v5. Upgrade your app following the [TanStack v5 migration guide](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5) — most notably, `useQuery(["key"], fn, opts)` is no longer accepted; use `useQuery({ queryKey, queryFn, ... })`. The hooks exported by this package already use the v5 form, so no consumer code change is required.

### Quickstart Example

```tsx
import { useSimplifiedTrack } from "spotify-react-query"

function TrackComponent({ id }: { id: string }) {
  const { data: track, isLoading } = useSimplifiedTrack(id)

  if (isLoading) return <div>Loading...</div>
  if (!track) return null

  return (
    <div>
      {track.name} by {track.artists[0].name}
    </div>
  )
}
```

### Simplified and Full Entities

For many Spotify API entities, there are two subtypes which are returned depending on your query - `simplified` and `full`. Please refer to the Spotify API documentation to differentiate between the two given the entity. In the majority of cases, the simplified result may be enough.

Under the hood, when a query fetches simplified data about related entities (eg. when you query for an album and it returns simplified artist and album tracks), the library will prime the cache with those entities. This means that if you first used the `useFullAlbum` hook to fetch an album, and then use a component leveraging the `useSimplifiedTrack` hook to render the tracks based on the album track URIs, **the data will already be in the cache and an additional network request will not be made**.

For this reason, it's recommended that you use the simplified entities wherever possible.

### Hooks

#### Tracks

```typescript
function useSimplifiedTrack(id: string, options?: ReactQueryOptions)
```

```typescript
function useFullTrack(id: string, options?: ReactQueryOptions)
```

```typescript
function useFullTracks(ids: string[], options?: ReactQueryOptions)
```

#### Albums

```typescript
function useSimplifiedAlbum(id: string, options?: ReactQueryOptions)
```

```typescript
function useFullAlbum(id: string, options?: ReactQueryOptions)
```

#### Artists

```typescript
function useSimplifiedArtist(id: string, options?: ReactQueryOptions)
```

```typescript
function useFullArtist(id: string, options?: ReactQueryOptions)
```

```typescript
function useFullArtists(ids: string[], options?: ReactQueryOptions)
```

#### Playlists

```typescript
function usePlaylist(id: string, options?: ReactQueryOptions)
```

```typescript
function usePlaylistTracks({
  variables?: { id: string; fields?: string; limit?: number; offset?: number; market?: string } },
  options?: ReactQueryOptions
)
```

#### Statistics

```typescript
function useUserTopTracks(
  variables: { limit?: number; offset?: number; time_range: "short_term" | "medium_term" | "long_term" },
  options?: ReactQueryOptions
)
```

```typescript
function useUserTopArtists(
  variables: { limit?: number; offset?: number; time_range: "short_term" | "medium_term" | "long_term" },
  options?: ReactQueryOptions
)
```

```typescript
function useRecentlyPlayedTracks(
  variables: { after?: number; before?: number; limit?: number },
  options?: ReactQueryOptions
)
```

### Spotify Client

You can access the underlying Spotify client from any component inside the provider:

```typescript
import { useSpotifyClient } from "spotify-react-query"

const client = useSpotifyClient()

client.getTracks(["3n3Ppam7vgaVa1iaRUc9Lp"]).then((res) => console.log(res.body))
```

The returned client is whatever you passed to `<SpotifyQueryProvider />`, narrowed to the `SpotifyClient` interface. If you provided a `spotify-web-api-node` instance, all of its extra methods are still available at runtime — you can cast back to its type to access them.

### Bring your own client

`SpotifyClient` is a structural interface. If you need a custom transport (e.g. a backend proxy that adds your own auth), implement only the methods you use:

```typescript
import type { SpotifyClient } from "spotify-react-query"

const customClient: SpotifyClient = {
  getAccessToken: () => myAuth.token,
  getTracks: async (ids) => {
    const res = await fetch(`/api/spotify/tracks?ids=${ids.join(",")}`)
    return { statusCode: res.status, body: await res.json() }
  },
  // ...other methods
}
```
