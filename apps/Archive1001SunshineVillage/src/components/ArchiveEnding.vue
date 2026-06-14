<script setup lang="ts">
import type { EndingReport } from '../types';

defineProps<{
  report: EndingReport;
}>();

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <section class="ending-screen">
    <div class="xp-dialog">
      <div class="xp-title">&nbsp;</div>
      <div class="xp-body">
        <p v-for="line in report.lines" :key="line">{{ line }}</p>
        <button type="button" @click="emit('confirm')">确认</button>
      </div>
    </div>
  </section>
</template>
