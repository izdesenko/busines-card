import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { GET_CONTACTS } from '@/graphql/queries';
import type { Contact } from '@/types';
import { useTextContentStore } from './textContent';

interface GetContactsResponse {
  getContacts: Contact[];
}

export const useContactsStore = defineStore('contacts', {
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
        const textContent = useTextContentStore();
        this.error =
          e instanceof Error
            ? e.message
            : textContent.get('text_error_loading_contacts', 'Не удалось загрузить контакты');
      } finally {
        this.loading = false;
      }
    },
  },
  state: () => ({
    error: null as string | null,
    items: [] as Contact[],
    loaded: false,
    loading: false,
  }),
});
