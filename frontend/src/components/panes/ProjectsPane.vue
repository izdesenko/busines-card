<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { useTextContentStore } from '@/stores/textContent';

const projectsStore = useProjectsStore();
const textContent = useTextContentStore();
onMounted(() => {
  projectsStore.fetch();
  textContent.fetch();
});

function techList(technologies: string): string[] {
  return technologies
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
</script>

<template>
  <div class="p-6 sm:p-7">
    <template v-if="projectsStore.error">
      <p class="text-sm text-coral">{{ projectsStore.error }}</p>
      <button type="button" class="btn mt-3" @click="projectsStore.fetch()">{{ textContent.get('btn_retry', 'повторить') }}</button>
    </template>

    <template v-else-if="projectsStore.loading && !projectsStore.loaded">
      <p class="text-xs text-faint">{{ textContent.get('prompt_loading', 'сканирование директории…') }}</p>
    </template>

    <template v-else>
      <p class="text-sm text-dim mb-4"><span class="text-mint">$</span> {{ textContent.get('prompt_projects', 'ls -la ~/projects') }}</p>

      <p v-if="projectsStore.items.length === 0" class="text-sm text-faint">
        {{ textContent.get('prompt_empty_projects', 'drwxr-xr-x  пусто — проекты ещё не добавлены в админке.') }}
      </p>

      <div
        v-for="project in projectsStore.items"
        :key="project.id"
        class="py-4 border-t border-borderSoft first:border-t-0"
      >
        <div class="flex items-baseline gap-2 flex-wrap">
          <span class="text-faint text-xs">drwxr-xr-x</span>
          <span class="font-display font-semibold text-mint">{{ project.title }}/</span>
        </div>

        <p class="text-[13px] text-dim mt-1.5 max-w-[62ch]">{{ project.description }}</p>

        <div class="flex flex-wrap gap-1.5 mt-2.5">
          <span
            v-for="tech in techList(project.technologies)"
            :key="tech"
            class="text-[11px] px-2 py-0.5 rounded-full border border-border text-faint"
          >
            {{ tech }}
          </span>
        </div>

        <div class="flex gap-4 mt-2.5 text-xs">
          <a
            v-if="project.githubLink"
            :href="project.githubLink"
            target="_blank"
            rel="noopener"
            class="text-dim hover:text-mint border-b border-transparent hover:border-mintDim transition-colors"
          >
            {{ textContent.get('link_github', 'github ↗') }}
          </a>
          <a
            v-if="project.liveLink"
            :href="project.liveLink"
            target="_blank"
            rel="noopener"
            class="text-dim hover:text-mint border-b border-transparent hover:border-mintDim transition-colors"
          >
            {{ textContent.get('link_live', 'live ↗') }}
          </a>
        </div>
      </div>
    </template>
  </div>
</template>
