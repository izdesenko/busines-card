<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ value: string; label?: string }>();
const copied = ref(false);

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value);
  } catch {
    // clipboard API недоступен — просто молча не показываем "copied ✓"
    return;
  }
  copied.value = true;
  setTimeout(() => (copied.value = false), 1400);
}
</script>

<template>
  <button type="button" class="btn" @click="copy">
    {{ copied ? 'copied ✓' : (label ?? 'copy') }}
  </button>
</template>
