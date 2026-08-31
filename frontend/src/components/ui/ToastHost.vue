<script setup lang="ts">
import { onMounted } from 'vue';
import { useToast } from '@/composables/useToast';
import { useTextContentStore } from '@/stores/textContent';

const { toasts, remove } = useToast();
const textContent = useTextContentStore();
onMounted(() => textContent.fetch());
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[min(320px,90vw)]">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="font-mono text-xs rounded-lg border px-3.5 py-3 shadow-2xl bg-surface/95 cursor-pointer"
        :class="t.type === 'success' ? 'border-mintDim text-mint' : 'border-coral/60 text-coral'"
        role="status"
        @click="remove(t.id)"
      >
        <span class="mr-1.5">{{ t.type === 'success' ? textContent.get('toast_icon_success', '✓') : textContent.get('toast_icon_error', '✕') }}</span>{{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
