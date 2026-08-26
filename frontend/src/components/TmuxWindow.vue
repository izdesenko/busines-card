<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { TmuxTab } from '@/types';

defineProps<{
  tabs: TmuxTab[];
  modelValue: string;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

function select(id: string) {
  emit('update:modelValue', id);
}

const clock = ref('');
let timer: ReturnType<typeof setInterval> | undefined;

function tick() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  clock.value = `${hh}:${mm}`;
}

onMounted(() => {
  tick();
  timer = setInterval(tick, 15_000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="rounded-[10px] border border-border bg-surface shadow-[0_20px_50px_-25px_rgba(0,0,0,.6)] overflow-hidden">
    <!-- Внешнее окно терминала -->
    <div class="flex items-center gap-2.5 px-3.5 py-2.5 bg-surface2 border-b border-borderSoft">
      <div class="flex gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-trafficRed"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-trafficYellow"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-trafficGreen"></span>
      </div>
      <span class="text-xs text-faint ml-1">ilya@dev — tmux</span>
    </div>

    <!-- tmux status/window bar -->
    <div class="flex items-center justify-between bg-surface2 border-b border-borderSoft overflow-x-auto">
      <span class="text-xs font-semibold text-mint px-3 py-2 border-r border-borderSoft whitespace-nowrap">
        [ilya-zdesenko]
      </span>

      <div class="flex gap-0.5 px-2 py-1.5" role="tablist" aria-label="tmux windows">
        <button
          v-for="(tab, i) in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="tab.id === modelValue"
          class="text-xs font-mono px-2.5 py-1.5 rounded whitespace-nowrap transition-colors"
          :class="
            tab.id === modelValue
              ? 'bg-mint text-bg font-semibold'
              : 'text-faint hover:text-dim'
          "
          @click="select(tab.id)"
        >
          <span class="opacity-60">{{ i }}:</span>{{ tab.label }}<span v-if="tab.id === modelValue">*</span>
        </button>
      </div>

      <span class="flex items-center gap-2 text-xs text-faint px-3 py-2 border-l border-borderSoft whitespace-nowrap">
        <span class="w-1.5 h-1.5 rounded-full bg-mint animate-statusPulse"></span>{{ clock }}
      </span>
    </div>

    <!-- Активная "панель" tmux -->
    <div class="relative">
      <slot />
    </div>
  </div>
</template>
