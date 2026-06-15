<script setup lang="ts">
import type { EndingContent, OrganKey } from '../types';

defineProps<{
  ending: EndingContent;
  weights: Record<OrganKey, number>;
}>();
</script>

<template>
  <section class="ending-view" aria-labelledby="ending-title">
    <div class="ending-symbol">{{ ending.title }}</div>
    <h1 id="ending-title">{{ ending.label }}</h1>
    <p>{{ ending.body }}</p>
    <div class="weight-report">
      <span>eye={{ weights.eye }}</span>
      <span>heart={{ weights.heart }}</span>
      <span>skin={{ weights.skin }}</span>
      <span>voice={{ weights.voice }}</span>
    </div>
    <strong>[End of Connection]</strong>
  </section>
</template>
