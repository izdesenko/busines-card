import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { GET_CONTACTS } from '@/graphql/queries';
import type { Contact } from '@/types';

interface GetContactsResponse {
  getContacts: Contact[];
}

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    items: [] as Contact[],
    loading: false,
    loaded: false,
    error: null as string | null,
  }),
  actions: {
    async fetch() {
      if (this.loaded || this.loading) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await gqlClient.request<GetContactsResponse>(GET_CONTACTS);
        this.items = data.getContacts;
        this.loaded = true;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Не удалось загрузить контакты';
      } finally {
        this.loading = false;
      }
    },
  },
});
