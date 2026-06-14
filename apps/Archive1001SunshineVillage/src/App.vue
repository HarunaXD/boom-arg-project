<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import type { BoardId, EvidenceRecord, GameLocks, ViewName } from './types';
import { getEndingReport, getThreadTags, migrateTagsToEvidence } from './data/threadDatabase';
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
  visitedTags: string[];
  evidenceLog: EvidenceRecord[];
  wrongMergeInputs: string[];
  recentRecords: string[];
  finished: boolean;
}

const saved = readSavedState();
const view = ref<ViewName>(saved.finished ? 'ending' : 'home');
const boardId = ref<BoardId>('cafe');
const threadId = ref('daily');
const threadPage = ref(1);
const userUid = ref('334');
const searchKeyword = ref('');
const rememberedKeyword = ref(saved.rememberedKeyword);
const finished = ref(saved.finished);
const takingOver = ref(false);
const onlineTick = ref(0);
const locks = reactive<GameLocks>({ ...saved.locks });
const inspectedRooms = ref<string[]>(saved.inspectedRooms);
const visitedTags = ref<string[]>(saved.visitedTags);
const evidenceLog = ref<EvidenceRecord[]>(saved.evidenceLog);
const wrongMergeInputs = ref<string[]>(saved.wrongMergeInputs);
const recentRecords = ref<string[]>(saved.recentRecords);
let onlineTimer = 0;

const unlockedPage = computed(() => {
  if (locks.s3) return 50;
  if (locks.s2) return 45;
  if (locks.s1) return 30;
  return 15;
});

const onlineCount = computed(() => {
  if (locks.s4 || finished.value) return 1;
  if (locks.s3) return [7, 4, 9, 2, 6][onlineTick.value % 5];
  if (locks.s2) return 140;
  return 302 - Math.min(17, threadPage.value);
});

const endingReport = computed(() => getEndingReport(evidenceLog.value));
const predictedRecords = computed(() => {
  if (locks.s3) return ['merge_target=1001', 'visitor_2026-06-15.tmp', 'archive_report'];
  if (locks.s2) return ['UID 334', 'vent_334.tmp', 'page 50'];
  if (locks.s1) return ['302 / 402', '一期交房户型平面图', 'room_width mismatch'];
  return ['#009 / 处理记录', '402 主卧', '通风口'];
});
const recentArchiveRecords = computed(() => [...new Set([...recentRecords.value, ...predictedRecords.value])].slice(0, 6));
const searchQuestions = computed(() => {
  const keyword = searchKeyword.value.trim();
  if (!keyword) return [];
  if (keyword.includes('墙') || keyword.includes('井')) return ['你为什么还在查', '你住哪一户', '请确认是否自行测量'];
  if (keyword.includes('通风') || keyword.includes('猫')) return ['请确认是否封堵通风口', '你昨晚睡着了吗', '呼吸记录未归档'];
  if (keyword.includes('1001')) return ['merge_target 已存在', '查看者是否同意合并', '请勿重复提交自己'];
  return ['没有找到相关记录', '服务器建议刷新', '刷新没有用'];
});

onMounted(() => {
  onlineTimer = window.setInterval(() => {
    onlineTick.value += 1;
  }, 800);
});

onUnmounted(() => {
  window.clearInterval(onlineTimer);
});

watch(
  [() => ({ ...locks }), inspectedRooms, rememberedKeyword, visitedTags, evidenceLog, wrongMergeInputs, recentRecords, finished],
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        locks,
        inspectedRooms: inspectedRooms.value,
        rememberedKeyword: rememberedKeyword.value,
        visitedTags: visitedTags.value,
        evidenceLog: evidenceLog.value,
        wrongMergeInputs: wrongMergeInputs.value,
        recentRecords: recentRecords.value,
        finished: finished.value,
      }),
    );
  },
  { deep: true },
);

function readSavedState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedState>;
      return {
        locks: parsed.locks ?? { s1: false, s2: false, s3: false, s4: false },
        inspectedRooms: parsed.inspectedRooms ?? [],
        rememberedKeyword: parsed.rememberedKeyword ?? '',
        visitedTags: parsed.visitedTags ?? [],
        evidenceLog: parsed.evidenceLog ?? migrateTagsToEvidence(parsed.visitedTags ?? []),
        wrongMergeInputs: parsed.wrongMergeInputs ?? [],
        recentRecords: parsed.recentRecords ?? [],
        finished: parsed.finished ?? false,
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    locks: { s1: false, s2: false, s3: false, s4: false },
    inspectedRooms: [],
    rememberedKeyword: '',
    visitedTags: [],
    evidenceLog: [],
    wrongMergeInputs: [],
    recentRecords: [],
    finished: false,
  };
}

function rememberVisit(label: string) {
  recentRecords.value = [label, ...recentRecords.value.filter((item) => item !== label)].slice(0, 4);
}

function rememberTags(tags: string[]) {
  const nextTags = new Set(visitedTags.value);
  tags.forEach((tag) => nextTags.add(tag));
  visitedTags.value = [...nextTags];
}

function rememberEvidence(evidence?: EvidenceRecord) {
  if (!evidence) return;
  const exists = evidenceLog.value.some(
    (item) => item.type === evidence.type && item.sourceThreadId === evidence.sourceThreadId && item.sourcePostId === evidence.sourcePostId,
  );
  if (!exists) {
    evidenceLog.value = [...evidenceLog.value, evidence];
  }
}

function openBoard(nextBoard: BoardId) {
  boardId.value = nextBoard;
  view.value = 'board';
}

function openThread(nextThread: string) {
  threadId.value = nextThread;
  threadPage.value = 1;
  rememberVisit(nextThread);
  if (nextThread !== 'daily') {
    rememberTags(getThreadTags(nextThread));
  }
  view.value = 'thread';
}

function openUser(uid: string) {
  userUid.value = uid;
  rememberVisit(`UID ${uid}`);
  if (uid === '334') {
    rememberTags(['awake-user']);
  }
  view.value = 'user';
}

function openPlan() {
  rememberVisit('一期交房户型平面图');
  view.value = 'plan';
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
  rememberTags(['awake-user']);
  if (locks.s2) {
    locks.s3 = true;
  }
}

function finale() {
  locks.s4 = true;
  finished.value = true;
  takingOver.value = true;

  const titles = ['阳光新村BBS - 闲聊茶馆', '■■ □ ■', '_OK_'];
  titles.forEach((title, index) => {
    window.setTimeout(() => {
      document.title = title;
    }, index * 450);
  });

  window.setTimeout(() => {
    takingOver.value = false;
    view.value = 'ending';
  }, 2600);
}

function confirmEnding() {
  const blob = new Blob([`archive_1001_final.txt\nOK\n${endingReport.value.fileSuffix}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'archive_1001_final.txt';
  anchor.click();
  URL.revokeObjectURL(url);
  document.body.innerHTML = '<pre class="not-found">404 Not Found</pre>';
}

function submitWrongMergeInput(value: string) {
  const cleaned = value.trim();
  if (cleaned) {
    wrongMergeInputs.value = [...wrongMergeInputs.value, cleaned].slice(-3);
  }
}
</script>

<template>
  <div class="bbs-app" :class="{ phase2: locks.s2, phase3: locks.s3, phase4: locks.s4 || finished, takeover: takingOver }">
    <header class="site-header">
      <div>
        <button type="button" class="logo" @click="view = 'home'">阳光新村BBS</button>
        <span>Discuz! 4.0 离线归档</span>
      </div>
      <form class="search-box" @submit.prevent="submitSearch">
        <input v-model="searchKeyword" :placeholder="rememberedKeyword ? `已记住：${rememberedKeyword}` : '搜索全站'" />
        <button type="submit">搜索</button>
        <div v-if="searchQuestions.length > 0" class="search-suggestions">
          <span v-for="question in searchQuestions" :key="question">{{ question }}</span>
        </div>
      </form>
    </header>

    <div class="status-strip">
      <span>在线人数：{{ onlineCount }}</span>
      <span>归档日期：2003-08-14</span>
      <span>当前位置：{{ view }}</span>
    </div>

    <ArchiveEnding v-if="view === 'ending'" :report="endingReport" @confirm="confirmEnding" />
    <ForumHome
      v-else-if="view === 'home'"
      :locks="locks"
      :online-count="onlineCount"
      :recent-records="recentArchiveRecords"
      @open-board="openBoard"
      @open-thread="openThread"
      @open-plan="openPlan"
    />
    <BoardView
      v-else-if="view === 'board'"
      :board-id="boardId"
      :floor-plan-available="locks.s1 || inspectedRooms.length >= 2"
      :locks="locks"
      @back="view = 'home'"
      @open-thread="openThread"
      @open-plan="openPlan"
    />
    <ThreadView
      v-else-if="view === 'thread'"
      :thread-id="threadId"
      :page="threadPage"
      :unlocked-page="unlockedPage"
      :locks="locks"
      :wrong-merge-inputs="wrongMergeInputs"
      @back="view = 'board'"
      @change-page="changeThreadPage"
      @inspect-user="inspectUser"
      @open-user="openUser"
      @open-thread="openThread"
      @record-evidence="rememberEvidence"
      @wrong-merge-input="submitWrongMergeInput"
      @unlock-zhao="unlockZhao"
      @finale="finale"
    />
    <SearchView v-else-if="view === 'search'" :keyword="searchKeyword" @back="view = 'home'" @open-thread="openThread" />
    <FloorPlanView v-else-if="view === 'plan'" :evidence-log="evidenceLog" :inspected-rooms="inspectedRooms" @back="view = 'board'" @unlock-space="unlockSpace" />
    <UserSpaceView
      v-else-if="view === 'user'"
      :uid="userUid"
      @back="view = 'thread'"
      @open-thread="openThread"
      @record-evidence="rememberEvidence"
      @unlock-vent="unlockVent"
    />
    <div v-if="takingOver" class="takeover-screen" aria-hidden="true"></div>
  </div>
</template>
