import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { GET_SKILLS } from '@/graphql/queries';
import type { SkillGroup } from '@/types';
import { useTextContentStore } from './textContent';

interface GetSkillsResponse {
  getSkills: SkillGroup[];
}

export const useSkillsStore = defineStore('skills', {
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
        const textContent = useTextContentStore();
        this.error =
          e instanceof Error
            ? e.message
            : textContent.get('text_error_loading_skills', 'Не удалось загрузить навыки');
      } finally {
        this.loading = false;
      }
    },
  },
  state: () => ({
    error: null as string | null,
    groups: [] as SkillGroup[],
    loaded: false,
    loading: false,
  }),
});
