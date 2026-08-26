import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { GET_TEXT_CONTENTS } from '@/graphql/queries';
import type { TextContent } from '@/types';

interface GetTextContentsResponse {
  getTextContents: TextContent[];
}

export const useTextContentStore = defineStore('textContent', {
  state: () => ({
    items: [] as TextContent[],
    loading: false,
    loaded: false,
    error: null as string | null,
  }),
  getters: {
    map(state): Record<string, string> {
      return Object.fromEntries(state.items.map((item) => [item.key, item.value]));
    },
  },
  actions: {
    async fetch() {
      if (this.loaded || this.loading) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await gqlClient.request<GetTextContentsResponse>(GET_TEXT_CONTENTS);
        this.items = data.getTextContents;
        this.loaded = true;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Не удалось загрузить контент';
      } finally {
        this.loading = false;
      }
    },
    get(key: string, fallback = ''): string {
      return this.map[key] ?? fallback;
    },
  },
});
