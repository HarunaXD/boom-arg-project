<script setup lang="ts">
import type { Devotee } from '../types';

const props = defineProps<{
  devotees: Devotee[];
  strawberryHarvested: boolean;
  eyeConfirmed: boolean;
}>();

const emit = defineEmits<{
  openSleepFormula: [];
  confirmEye094: [];
}>();

function statusFor(devotee: Devotee) {
  if (devotee.id === '草莓奶昔' && props.strawberryHarvested) return '已收割';
  return devotee.status;
}
</script>

<template>
  <section class="view devotees-view" aria-labelledby="devotees-title">
    <div class="view-heading">
      <p>Æ-Devotees / 狂热者名录</p>
      <h1 id="devotees-title">贡献越高，越接近她</h1>
    </div>

    <div class="devotee-table">
      <article v-for="devotee in devotees" :key="devotee.id" class="devotee-row" :class="`status-${statusFor(devotee)}`">
        <strong class="rank">#{{ devotee.rank.toString().padStart(2, '0') }}</strong>
        <span class="avatar">{{ devotee.id.slice(0, 1) }}</span>
        <div class="devotee-main">
          <h2>{{ devotee.id }}</h2>
          <p>
            <button
              v-if="devotee.rank === 1"
              type="button"
              class="text-link"
              @click="emit('openSleepFormula')"
            >
              每晚都用她推荐的配方。
            </button>
            <span v-else>{{ devotee.signature }}</span>
          </p>
        </div>
        <span class="score">{{ devotee.score }}</span>
        <button
          v-if="devotee.id === '094号信徒' && statusFor(devotee) === '已收割'"
          type="button"
          class="status status-button"
          @click="emit('confirmEye094')"
        >
          [{{ props.eyeConfirmed ? '已验证' : '已收割' }}]
        </button>
        <span v-else class="status">[{{ statusFor(devotee) }}]</span>
      </article>
    </div>
  </section>
</template>
