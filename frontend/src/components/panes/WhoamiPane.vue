<script setup lang="ts">
import { onMounted } from 'vue';
import { useTextContentStore } from '@/stores/textContent';

const textContent = useTextContentStore();
onMounted(() => textContent.fetch());
</script>

<template>
  <div class="p-6 sm:p-7">
    <template v-if="textContent.error">
      <p class="text-sm text-coral">{{ textContent.error }}</p>
      <button
        type="button"
        class="btn mt-3"
        @click="textContent.fetch()"
      >повторить</button>
    </template>

    <template v-else>
      <p class="text-sm text-dim mb-1"><span class="text-mint">$</span> whoami</p>

      <div class="font-display font-bold text-3xl sm:text-4xl md:text-[46px] -tracking-tight mb-1 min-h-[1.2em]">
        <span
          v-if="textContent.loading && !textContent.loaded"
          class="text-faint"
        >…</span>
        <span v-else>{{ textContent.get('hero_title', 'root') }}</span>
      </div>

      <p class="font-display font-medium text-[15px] sm:text-lg text-amber mb-6">
        {{ textContent.get('hero_role', 'root') }}
      </p>

      <p class="text-sm text-dim mb-1 mt-1.5"><span class="text-mint">$</span> cat about.txt</p>

      <div
        class="text-[13.5px] leading-relaxed text-dim border-l-2 border-border pl-3.5 max-w-[52ch] [&_p]:mb-2 last:[&_p]:mb-0"
        v-html="textContent.get('about_me', '')"
      ></div>

      <p class="text-sm text-dim mt-6">
        <span class="text-mint">$</span>
        <span class="inline-block w-[0.5em] h-[0.85em] bg-mint align-middle ml-1 animate-blink"></span>
      </p>
    </template>
  </div>
</template>
