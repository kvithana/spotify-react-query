# Spotify React Query

Simple React Query hooks for the Spotify Web API. With the power of [React Query](https://tanstack.com/query/v4/docs/quick-start), requests for Spotify resources are automatically cached, and by leveraging [dataloader](https://github.com/graphql/dataloader) under the hood, we can batch calls for similar resources to avoid using up your Spotify API quota.

This package is used by musictaste.space.

> 🚨 This package is currently not ready for production and the API has not been finalized.

## Install

Install this package by running the following command in your project:

```
yarn add spotify-react-query
```

## Usage

In order to use the hooks, you must wrap dependent components in a `SpotifyQueryProvider` and pass in a [React Query](https://tanstack.com/query/v4/docs/quick-start) `QueryClient`. The client can be customized to suit your use case, or you can pass in the default client and it will work out of the box.

### SpotifyQueryProvider

```typescript
import { QueryClient } from "@tanstack/react-query"

const client = new QueryClient()

const App = () => {
  const accessToken = "" // retrieve an access token somehow

  return (
    <SpotifyQueryProvider client={client} accessToken={accessToken}>
      <DependentComponents />
    </SpotifyQueryProvider>
  )
}
```

### Quickstart Example

```typescript
import { useSimplifiedTrack } from "spotify-react-query"

function TrackComponent({ uri }: { uri: string }) {
  const { data: track, isLoading } = useSimplifiedTrack(uri)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!track) {
    return null
  }

  return (
    <div>
      {track.name} by ${track.artists[0].name}
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
useSimplifiedTrack(uri: string, options?: ReactQueryOptions)
```

```typescript
useFullTrack(uri: string, options?: ReactQueryOptions)
```

#### Albums

```typescript
useSimplifiedAlbum(uri: string, options?: ReactQueryOptions)
```

```typescript
useFullAlbum(uri: string, options?: ReactQueryOptions)
```

#### Artists

```typescript
useSimplifiedArtist(uri: string, options?: ReactQueryOptions)
```

```typescript
useFullArtist(uri: string, options?: ReactQueryOptions)
```

#### Playlists

```typescript
usePlaylist(uri: string, options?: ReactQueryOptions)
```

```typescript
usePlaylistTracks(uri: string, options?: ReactQueryOptions & { variables?: { fields?: string; limit?: number; offset?: number; market?: string } })
```

### Spotify Client

You can also use the Spotify client directly to leverage all the methods available via `spotify-web-api-node`

```typescript
import { useSpotifyClient } from "spotify-react-query"

const client = useSpotifyClient()

client.getMe().then((res) => console.log(res.body))
```
