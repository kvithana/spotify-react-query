import type { UseQueryOptions } from "@tanstack/react-query"

export const DEFAULT_QUERY_CONFIG = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: Infinity,
} as const

type QueryOverrides<TData> = Omit<UseQueryOptions<any, any, TData, any>, "queryKey" | "queryFn" | "initialData">

/**
 * Merge caller-provided React Query options on top of the library defaults.
 * Returned shape is intended to be **spread** into a v5 `useQuery({ ... })`
 * call site — `queryKey`/`queryFn` are supplied by the caller.
 */
export const config = <TData>(overrides?: QueryOverrides<TData>): QueryOverrides<TData> => ({
  ...DEFAULT_QUERY_CONFIG,
  ...overrides,
})
