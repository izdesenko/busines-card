<script setup lang="ts">
import { ref } from 'vue';
import TmuxWindow from '@/components/TmuxWindow.vue';
import type { TmuxTab } from '@/types';
import WhoamiPane from '@/components/panes/WhoamiPane.vue';
import HtopPane from '@/components/panes/HtopPane.vue';
import ProjectsPane from '@/components/panes/ProjectsPane.vue';
import SendmailPane from '@/components/panes/SendmailPane.vue';
import ToastHost from '@/components/ui/ToastHost.vue';

const tabs: TmuxTab[] = [
  { id: 'whoami', label: 'whoami' },
  { id: 'htop', label: 'htop' },
  { id: 'projects', label: 'projects' },
  { id: 'sendmail', label: 'sendmail' },
];

const active = ref('whoami');
</script>

<template>
  <div class="min-h-screen bg-grid px-5 py-12">
    <div class="max-w-[860px] mx-auto flex flex-col gap-3.5">
      <TmuxWindow v-model="active" :tabs="tabs">
        <Transition name="fade" mode="out-in">
          <WhoamiPane v-if="active === 'whoami'" key="whoami" />
          <HtopPane v-else-if="active === 'htop'" key="htop" />
          <ProjectsPane v-else-if="active === 'projects'" key="projects" />
          <SendmailPane v-else key="sendmail" />
        </Transition>
      </TmuxWindow>

      <div class="flex justify-between text-[11px] text-faint px-1 flex-wrap gap-2">
        <span>container: ilya-zdesenko:latest</span>
        <span>restart: unless-stopped</span>
      </div>
    </div>

    <ToastHost />
  </div>
</template>
