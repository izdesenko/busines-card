<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSkillsStore } from '@/stores/skills';

const skillsStore = useSkillsStore();
onMounted(() => skillsStore.fetch());

const totalSkills = computed(() => skillsStore.groups.reduce((sum, g) => sum + g.skills.length, 0));

// Просто "средняя загрузка" по всем навыкам — декоративная деталь под htop,
// но посчитана из реальных данных, а не захардкожена.
const loadAverage = computed(() => {
  if (totalSkills.value === 0) return '0.00';
  const avg =
    skillsStore.groups.flatMap((g) => g.skills).reduce((s, sk) => s + sk.level, 0) /
    totalSkills.value /
    100;
  return avg.toFixed(2);
});
</script>

<template>
  <div class="p-6 sm:p-7">
    <template v-if="skillsStore.error">
      <p class="text-sm text-coral">{{ skillsStore.error }}</p>
      <button type="button" class="btn mt-3" @click="skillsStore.fetch()">повторить</button>
    </template>

    <template v-else-if="skillsStore.loading && !skillsStore.loaded">
      <p class="text-xs text-faint">загрузка процессов…</p>
    </template>

    <template v-else>
      <p class="text-xs text-faint mb-0.5">
        Tasks: {{ totalSkills }} total,
        {{ totalSkills }}
        running · Load average:
        {{ loadAverage }}
      </p>
      <p class="text-xs text-faint mb-4">
        Mem <span class="text-mint">[||||||||||||</span><span class="text-border">|||||]</span>
        занят делом
      </p>

      <div v-for="group in skillsStore.groups" :key="group.category" class="mb-5 last:mb-0">
        <p class="text-[11px] tracking-wide text-faint mb-1.5">
          {{ group.category.toUpperCase() }}
        </p>

        <div
          class="grid grid-cols-[46px_1fr_64px] gap-3.5 px-2.5 pb-1.5 text-[11px] tracking-wide text-faint border-b border-borderSoft"
        >
          <span>PID</span><span>COMMAND</span><span class="text-right">CPU</span>
        </div>

        <div
          v-for="(skill, i) in group.skills"
          :key="skill.id"
          class="grid grid-cols-[46px_1fr_64px] items-center gap-3.5 px-2.5 py-2.5 border-t border-borderSoft first:border-t-0 text-[13px] hover:bg-mint/[.04] transition-colors"
        >
          <span class="text-faint">{{ i + 1 }}</span>
          <span class="text-mint font-semibold">{{ skill.name }}</span>
          <span class="flex items-center gap-2 justify-self-end w-full">
            <span
              class="relative flex-1 h-1.5 bg-borderSoft rounded-full overflow-hidden min-w-[50px]"
            >
              <span
                class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mint to-amber"
                :style="{ width: skill.level + '%' }"
              ></span>
            </span>
            <span class="text-dim text-xs w-8 text-right">{{ skill.level }}%</span>
          </span>
        </div>
      </div>

      <p v-if="totalSkills === 0" class="text-sm text-faint">Навыки ещё не добавлены в админке.</p>
    </template>
  </div>
</template>
