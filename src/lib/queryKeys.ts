export const queryKeys = {
  search: (params: object) => ['recipes', 'search', params] as const,
  details: (id: number) => ['recipes', 'details', id] as const,
  random: (count: number, tags?: string) => ['recipes', 'random', count, tags ?? ''] as const,
  category: (slug: string, offset: number) => ['recipes', 'category', slug, offset] as const,
}

export const STALE_TIME = {
  search: 5 * 60 * 1000,
  details: 30 * 60 * 1000,
  random: 10 * 60 * 1000,
  category: 10 * 60 * 1000,
}
