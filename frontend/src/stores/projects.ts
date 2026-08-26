import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { GET_PROJECTS } from '@/graphql/queries';
import type { Project } from '@/types';

interface GetProjectsResponse {
  getProjects: Project[];
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    items: [] as Project[],
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
        const data = await gqlClient.request<GetProjectsResponse>(GET_PROJECTS);
        this.items = data.getProjects;
        this.loaded = true;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Не удалось загрузить проекты';
      } finally {
        this.loading = false;
      }
    },
  },
});
