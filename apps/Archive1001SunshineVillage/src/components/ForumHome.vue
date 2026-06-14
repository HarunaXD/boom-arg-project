<script setup lang="ts">
import type { BoardId, GameLocks } from '../types';
import { boards } from '../data/boards';
import { boardThreads } from '../data/threadDatabase';

defineProps<{
  locks: GameLocks;
  onlineCount: number;
  recentRecords: string[];
}>();

const emit = defineEmits<{
  openBoard: [boardId: BoardId];
  openThread: [threadId: string];
  openPlan: [];
}>();
</script>

<template>
  <section class="panel home-panel">
    <div class="panel-title">
      <span>阳光新村BBS - 离线归档</span>
      <strong>在线 {{ onlineCount }}</strong>
    </div>

    <div class="board-list">
      <article v-for="board in boards" :key="board.id" class="board-row">
        <button class="board-icon" :class="{ pulse: locks.s2 && board.id === 'cafe' }" type="button" @click="emit('openBoard', board.id)">
          {{ locks.s2 && board.id === 'cafe' ? '●' : '□' }}
        </button>
        <div>
          <button class="linklike board-title" type="button" @click="emit('openBoard', board.id)">{{ board.name }}</button>
          <p>{{ board.description }}</p>
          <small>版主：{{ board.moderator }}</small>
        </div>
        <div class="board-stats">
          <span>{{ boardThreads.filter((thread) => thread.boardId === board.id).length }}</span>
          <small>主题</small>
        </div>
      </article>
    </div>

    <div class="quick-links">
      <button type="button" @click="emit('openThread', 'daily')">进入置顶热帖</button>
      <button type="button" @click="emit('openPlan')" :disabled="!locks.s1">查看户型图</button>
    </div>

    <section class="recent-records">
      <h2>最近浏览</h2>
      <ol>
        <li v-for="record in recentRecords" :key="record">{{ record }}</li>
      </ol>
    </section>
  </section>
</template>
