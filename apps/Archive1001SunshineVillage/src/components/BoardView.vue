<script setup lang="ts">
import type { BoardId } from '../types';
import { boards, boardThreads } from '../data/boards';
import { users } from '../data/users';

const props = defineProps<{
  boardId: BoardId;
  floorPlanAvailable: boolean;
}>();

const emit = defineEmits<{
  back: [];
  openThread: [threadId: string];
  openPlan: [];
}>();

const board = boards.find((item) => item.id === props.boardId)!;
const threads = boardThreads.filter((thread) => thread.boardId === props.boardId);
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
            <p>{{ thread.summary }}</p>
          </td>
          <td>{{ users[thread.authorUid]?.name ?? '匿名' }}</td>
          <td>{{ thread.replies }}</td>
          <td>{{ thread.createdAt }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
