<script setup lang="ts">
import { computed } from 'vue';
import type { BoardId, GameLocks } from '../types';
import { boards } from '../data/boards';
import { boardThreads } from '../data/threadDatabase';

const props = defineProps<{
  boardId: BoardId;
  floorPlanAvailable: boolean;
  locks: GameLocks;
}>();

const emit = defineEmits<{
  back: [];
  openThread: [threadId: string];
  openPlan: [];
}>();

const board = boards.find((item) => item.id === props.boardId)!;
const digestionOrder = ['daily', 'zhao-final', 'rules', 'floorplan', 'bed', 'wardrobe', 'kids-bed', 'password', 'cat-vent', 'property-memo', 'notice-revision'];
const threads = computed(() => {
  const list = boardThreads.filter((thread) => thread.boardId === props.boardId);
  if (!props.locks.s3) return list;
  return [...list].sort((left, right) => {
    const leftIndex = digestionOrder.indexOf(left.id);
    const rightIndex = digestionOrder.indexOf(right.id);
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });
});
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回首页</button>
      <span>{{ board.name }}</span>
    </div>
    <table class="thread-table">
      <thead>
        <tr>
          <th>主题</th>
          <th>作者</th>
          <th>回复</th>
          <th>时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="thread in threads" :key="thread.id">
          <td>
            <button
              v-if="thread.id === 'floorplan'"
              type="button"
              class="linklike"
              :class="{ disabled: !floorPlanAvailable }"
              @click="floorPlanAvailable ? emit('openPlan') : undefined"
            >
              {{ floorPlanAvailable ? thread.title : '404 - 一期交房户型平面图' }}
            </button>
            <button v-else type="button" class="linklike" @click="emit('openThread', thread.id)">
              <span v-if="thread.pinned">[置顶]</span>
              {{ thread.title }}
            </button>
            <p class="thread-preview">{{ thread.preview }}</p>
            <div v-if="thread.tags?.length" class="thread-tags">
              <span v-for="tag in thread.tags" :key="tag">{{ tag }}</span>
            </div>
          </td>
          <td>{{ thread.authorName }}</td>
          <td>{{ thread.replies }}</td>
          <td>{{ locks.s3 ? '2003-08-14 03:02' : thread.createdAt }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
