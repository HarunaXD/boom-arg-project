<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { BoardId, GameLocks, ViewName } from './types';
import { evidenceRooms } from './data/users';
import BoardView from './components/BoardView.vue';
import ArchiveEnding from './components/ArchiveEnding.vue';
import FloorPlanView from './components/FloorPlanView.vue';
import ForumHome from './components/ForumHome.vue';
import SearchView from './components/SearchView.vue';
import ThreadView from './components/ThreadView.vue';
import UserSpaceView from './components/UserSpaceView.vue';
import './styles.css';

const STORAGE_KEY = 'archive-1001-state';

interface SavedState {
  locks: GameLocks;
  inspectedRooms: string[];
  rememberedKeyword: string;
  finished: boolean;
}

const saved = readSavedState();
const view = ref<ViewName>(saved.finished ? 'ending' : 'home');
const boardId = ref<BoardId>('cafe');
const threadId = ref('daily');
const threadPage = ref(1);
const searchKeyword = ref('');
const rememberedKeyword = ref(saved.rememberedKeyword);
const finished = ref(saved.finished);
const locks = reactive<GameLocks>({ ...saved.locks });
const inspectedRooms = ref<string[]>(saved.inspectedRooms);

const unlockedPage = computed(() => {
  if (locks.s3) return 50;
  if (locks.s2) return 45;
  if (locks.s1) return 30;
  return 15;
});

const onlineCount = computed(() => {
  if (locks.s4 || finished.value) return 1;
  if (locks.s3) return 7;
  if (locks.s2) return 140;
  return 302 - Math.min(17, threadPage.value);
});

watch(
  [() => ({ ...locks }), inspectedRooms, rememberedKeyword, finished],
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        locks,
        inspectedRooms: inspectedRooms.value,
        rememberedKeyword: rememberedKeyword.value,
        finished: finished.value,
      }),
    );
  },
  { deep: true },
);

function readSavedState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SavedState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    locks: { s1: false, s2: false, s3: false, s4: false },
    inspectedRooms: [],
    rememberedKeyword: '',
    finished: false,
  };
}

function openBoard(nextBoard: BoardId) {
  boardId.value = nextBoard;
  view.value = 'board';
}

function openThread(nextThread: string) {
  threadId.value = nextThread;
  threadPage.value = 1;
  view.value = 'thread';
}

function changeThreadPage(page: number) {
  if (page <= unlockedPage.value) {
    threadPage.value = page;
    window.scrollTo({ top: 0 });
  }
}

function submitSearch() {
  const keyword = searchKeyword.value.trim();
  if (!keyword) return;
  rememberedKeyword.value = keyword.includes('老赵') || keyword.includes('009') ? '老赵' : rememberedKeyword.value;
  view.value = 'search';
}

function inspectUser(_uid: string, room: string) {
  if (evidenceRooms.has(room) && !inspectedRooms.value.includes(room)) {
    inspectedRooms.value = [...inspectedRooms.value, room];
  }
}

function unlockZhao() {
  locks.s1 = true;
  rememberedKeyword.value = '老赵';
}

function unlockSpace() {
  locks.s2 = true;
}

function unlockVent() {
  locks.s3 = true;
}

function finale() {
  locks.s4 = true;
  finished.value = true;
  view.value = 'ending';
  document.title = '_OK_';
}

function confirmEnding() {
  const blob = new Blob(['archive_1001_final.txt\nOK\n'], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'archive_1001_final.txt';
  anchor.click();
  URL.revokeObjectURL(url);
  document.body.innerHTML = '<pre class="not-found">404 Not Found</pre>';
}
</script>

<template>
  <div class="bbs-app" :class="{ phase2: locks.s2, phase3: locks.s3, phase4: locks.s4 || finished }">
    <header class="site-header">
      <div>
        <button type="button" class="logo" @click="view = 'home'">阳光新村BBS</button>
        <span>Discuz! 4.0 离线归档</span>
      </div>
      <form class="search-box" @submit.prevent="submitSearch">
        <input v-model="searchKeyword" :placeholder="rememberedKeyword ? `已记住：${rememberedKeyword}` : '搜索全站'" />
        <button type="submit">搜索</button>
      </form>
    </header>

    <div class="status-strip">
      <span>在线人数：{{ onlineCount }}</span>
      <span>归档日期：2003-08-14</span>
      <span>当前位置：{{ view }}</span>
    </div>

    <ArchiveEnding v-if="view === 'ending'" @confirm="confirmEnding" />
    <ForumHome v-else-if="view === 'home'" :locks="locks" :online-count="onlineCount" @open-board="openBoard" @open-thread="openThread" @open-plan="view = 'plan'" />
    <BoardView
      v-else-if="view === 'board'"
      :board-id="boardId"
      :floor-plan-available="locks.s1 || inspectedRooms.length >= 2"
      @back="view = 'home'"
      @open-thread="openThread"
      @open-plan="view = 'plan'"
    />
    <ThreadView
      v-else-if="view === 'thread'"
      :thread-id="threadId"
      :page="threadPage"
      :unlocked-page="unlockedPage"
      :locks="locks"
      @back="view = 'board'"
      @change-page="changeThreadPage"
      @inspect-user="inspectUser"
      @open-user="view = 'user'"
      @unlock-zhao="unlockZhao"
      @finale="finale"
    />
    <SearchView v-else-if="view === 'search'" :keyword="searchKeyword" @back="view = 'home'" @open-thread="openThread" />
    <FloorPlanView v-else-if="view === 'plan'" :inspected-rooms="inspectedRooms" @back="view = 'board'" @unlock-space="unlockSpace" />
    <UserSpaceView v-else-if="view === 'user'" @back="view = 'thread'" @unlock-vent="unlockVent" />
  </div>
</template>
