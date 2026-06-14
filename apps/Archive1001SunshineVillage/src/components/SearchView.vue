<script setup lang="ts">
import { boardThreads, searchThreads } from '../data/threadDatabase';

const props = defineProps<{
  keyword: string;
}>();

const emit = defineEmits<{
  back: [];
  openThread: [threadId: string];
}>();

const normalized = props.keyword.trim().toLowerCase();
const isZhao = normalized.includes('老赵') || normalized.includes('009');
const isSensitive = ['墙', '黄水', '凿墙', '软', '回缩'].some((word) => props.keyword.includes(word));
const results = isZhao
  ? boardThreads.filter((thread) => ['zhao-final', 'daily'].includes(thread.id))
  : isSensitive
    ? boardThreads.filter((thread) => ['zhao-final', 'notice-revision', 'property-memo', 'daily'].includes(thread.id))
  : searchThreads(props.keyword);
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回首页</button>
      <span>搜索：{{ keyword }}</span>
    </div>

    <div v-if="isZhao || isSensitive" class="warning">
      检索词命中屏蔽表。以下结果来自处理记录缓存，标题可能已被修订。
    </div>

    <ul class="search-results">
      <li v-for="thread in results" :key="thread.id">
        <button type="button" class="linklike" @click="emit('openThread', thread.id)">{{ thread.title }}</button>
        <p class="thread-preview">{{ thread.preview }}</p>
        <div v-if="thread.tags.length" class="thread-tags">
          <span v-for="tag in thread.tags" :key="tag">{{ tag }}</span>
        </div>
      </li>
    </ul>

    <p v-if="results.length === 0" class="empty">没有找到相关记录。服务器建议刷新，但刷新没有用。</p>
  </section>
</template>
