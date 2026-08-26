import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { GET_SKILLS } from '@/graphql/queries';
import type { SkillGroup } from '@/types';

interface GetSkillsResponse {
  getSkills: SkillGroup[];
}

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    groups: [] as SkillGroup[],
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
        const data = await gqlClient.request<GetSkillsResponse>(GET_SKILLS);
        this.groups = data.getSkills;
        this.loaded = true;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Не удалось загрузить навыки';
      } finally {
        this.loading = false;
      }
    },
  },
});
