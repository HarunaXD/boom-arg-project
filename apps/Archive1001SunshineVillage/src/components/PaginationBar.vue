<script setup lang="ts">
defineProps<{
  page: number;
  maxPage: number;
  unlockedPage: number;
}>();

const emit = defineEmits<{
  change: [page: number];
}>();

function pageTitle(item: number, unlockedPage: number) {
  if (item <= unlockedPage) return `第 ${item} 页`;
  if (unlockedPage < 30 && item === 16) return '处理记录 009 缺失';
  if (unlockedPage < 45 && item === 31) return '你还没有量完';
  if (unlockedPage < 50 && item === 46) return '还有一个人醒着';
  return '页码字段未归档';
}
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
      :title="pageTitle(item, unlockedPage)"
      @click="emit('change', item)"
    >
      {{ item }}
    </button>
    <button type="button" :disabled="page >= unlockedPage" @click="emit('change', page + 1)">下一页</button>
  </nav>
</template>
