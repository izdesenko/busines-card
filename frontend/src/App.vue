<script setup lang="ts">
import { ref } from 'vue';
import HtopPane from '@/components/panes/HtopPane.vue';
import ProjectsPane from '@/components/panes/ProjectsPane.vue';
import SendmailPane from '@/components/panes/SendmailPane.vue';
import WhoamiPane from '@/components/panes/WhoamiPane.vue';
import TmuxWindow from '@/components/TmuxWindow.vue';
import ToastHost from '@/components/ui/ToastHost.vue';
import { useTextContentStore } from '@/stores/textContent';
import type { TmuxTab } from '@/types';

const textContent = useTextContentStore();
textContent.fetch();

const tabs: TmuxTab[] = [
  { id: 'whoami', label: textContent.get('nav_whoami', 'id') },
  { id: 'htop', label: textContent.get('nav_htop', 'htop') },
  { id: 'projects', label: textContent.get('nav_projects', 'ls -la ~/work') },
  { id: 'sendmail', label: textContent.get('nav_sendmail', 'sendmail') },
];

const active = ref('whoami');
</script>

<template>
  <div class="min-h-screen bg-grid px-5 py-12">
    <div class="max-w-[860px] mx-auto flex flex-col gap-3.5">
      <TmuxWindow
        v-model="active"
        :tabs="tabs"
      >
        <Transition
          name="fade"
          mode="out-in"
        >
          <SendmailPane
            v-if="active === 'sendmail'"
            key="sendmail"
          />
          <HtopPane
            v-else-if="active === 'htop'"
            key="htop"
          />
          <ProjectsPane
            v-else-if="active === 'projects'"
            key="projects"
          />
          <WhoamiPane
            v-else
            key="whoami"
          />
        </Transition>
      </TmuxWindow>

      <div class="flex justify-between text-[11px] text-faint px-1 flex-wrap gap-2">
        <span>container: {{ textContent.get('container_image', 'user:latest') }}</span>
        <span>restart: {{ textContent.get('container_restart', 'unless-stopped') }}</span>
      </div>
    </div>

    <ToastHost />
  </div>
</template>
