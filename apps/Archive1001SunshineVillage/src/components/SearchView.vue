<script setup lang="ts">
import { boardThreads } from '../data/boards';
import { users } from '../data/users';

const props = defineProps<{
  keyword: string;
}>();

const emit = defineEmits<{
  back: [];
  openThread: [threadId: string];
}>();

const normalized = props.keyword.trim().toLowerCase();
const isZhao = normalized.includes('老赵') || normalized.includes('009');
const results = isZhao
  ? boardThreads.filter((thread) => ['zhao-final', 'daily'].includes(thread.id))
  : boardThreads.filter((thread) => thread.title.toLowerCase().includes(normalized) || users[thread.authorUid]?.name.includes(props.keyword));
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回首页</button>
      <span>搜索：{{ keyword }}</span>
    </div>

    <div v-if="isZhao" class="warning">
      用户“老赵”因散布不实信息被永久禁言，请不信谣、不传谣。
    </div>

    <ul class="search-results">
      <li v-for="thread in results" :key="thread.id">
        <button type="button" class="linklike" @click="emit('openThread', thread.id)">{{ thread.title }}</button>
        <p>{{ thread.summary }}</p>
      </li>
    </ul>

    <p v-if="results.length === 0" class="empty">没有找到相关记录。服务器建议刷新，但刷新没有用。</p>
  </section>
</template>
