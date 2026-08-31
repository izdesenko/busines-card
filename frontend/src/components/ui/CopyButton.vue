<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTextContentStore } from '@/stores/textContent';

const props = defineProps<{ value: string; label?: string }>();
const textContent = useTextContentStore();
const copied = ref(false);

onMounted(() => textContent.fetch());

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value);
  } catch {
    return;
  }
  copied.value = true;
  setTimeout(() => (copied.value = false), 1400);
}
</script>

<template>
  <button type="button" class="btn" @click="copy">
    {{ copied ? textContent.get('btn_copied', 'copied ✓') : (label ?? textContent.get('btn_copy', 'copy')) }}
  </button>
</template>
