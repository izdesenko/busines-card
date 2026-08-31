import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { GET_PROJECTS } from '@/graphql/queries';
import type { Project } from '@/types';
import { useTextContentStore } from './textContent';

interface GetProjectsResponse {
  getProjects: Project[];
}

export const useProjectsStore = defineStore('projects', {
  actions: {
    async fetch() {
      if (this.loaded || this.loading) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await gqlClient.request<GetProjectsResponse>(GET_PROJECTS);
        this.items = data.getProjects;
        this.loaded = true;
      } catch (e) {
        const textContent = useTextContentStore();
        this.error =
          e instanceof Error
            ? e.message
            : textContent.get('text_error_loading_projects', 'Не удалось загрузить проекты');
      } finally {
        this.loading = false;
      }
    },
  },
  state: () => ({
    error: null as string | null,
    items: [] as Project[],
    loaded: false,
    loading: false,
  }),
});
