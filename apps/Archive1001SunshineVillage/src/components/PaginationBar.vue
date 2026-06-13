<script setup lang="ts">
defineProps<{
  page: number;
  maxPage: number;
  unlockedPage: number;
}>();

const emit = defineEmits<{
  change: [page: number];
}>();
</script>

<template>
  <nav class="pagination" aria-label="分页">
    <button type="button" :disabled="page <= 1" @click="emit('change', page - 1)">上一页</button>
    <button
      v-for="item in maxPage"
      :key="item"
      type="button"
      :class="{ active: item === page, locked: item > unlockedPage }"
      :disabled="item > unlockedPage"
      @click="emit('change', item)"
    >
      {{ item }}
    </button>
    <button type="button" :disabled="page >= unlockedPage" @click="emit('change', page + 1)">下一页</button>
  </nav>
</template>
