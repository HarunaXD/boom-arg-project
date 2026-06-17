<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import BoutiqueView from './components/BoutiqueView.vue';
import DevoteesView from './components/DevoteesView.vue';
import EndingView from './components/EndingView.vue';
import GalleryView from './components/GalleryView.vue';
import ScannerView from './components/ScannerView.vue';
import V1ArchiveView from './components/V1ArchiveView.vue';
import { devotees, endingContent, navItems, terminalCommands } from './data/gameData';
import type { ContextMenuState, GameState, OrganKey, TerminalEntry, ViewId } from './types';
import './styles.css';

const STORAGE_KEY = 'archive-1002-aedvent-state';
const TEST_MODE = new URLSearchParams(window.location.search).has('testMode');
const countdownSeconds = TEST_MODE ? 30 : 10;
const initialState = readSavedState();

const view = ref<ViewId>(window.location.pathname.endsWith('/v1') ? 'v1' : 'gallery');
const terminalInput = ref('');
const terminalHistory = ref<TerminalEntry[]>(initialState.terminalHistory);
const state = reactive<GameState>(initialState);
const countdown = ref(initialState.endingStarted && !initialState.endingType ? countdownSeconds : 0);
const onlineTick = ref(0);
const terminalRef = ref<HTMLInputElement | null>(null);
const contextMenu = reactive<ContextMenuState>({
  open: false,
  x: 0,
  y: 0,
  photoId: '',
  targetLabel: '',
});
let countdownTimer = 0;
let onlineTimer = 0;

const visibleNavItems = computed(() => navItems.filter((item) => !item.hidden || state.v1Unlocked));
const caseNotes = computed(() => {
  const notes = [];
  notes.push('镜像站伪装为 2000 年代粉丝官网，图片与商品页优先复核。');
  if (state.triggeredHotspots['eye-left']) notes.push('编号 094 首次出现在圣像眼部，请去粉丝榜确认它是不是账号。');
  if (state.sideQuests.eye094Confirmed) notes.push('094 已在粉丝榜中确认。它不是编号，是被处理过的人。');
  if (state.triggeredHotspots.mouth) notes.push('嘴唇反写的房间号缺少楼层，周边页可能有后台平面图。');
  if (state.sideQuests.donorRoom) notes.push('草莓奶昔状态已改变。她的最后一句话不是留言，是体征记录。');
  if (state.v1Unlocked) notes.push('V1.0 归档暴露。这个粉丝站不是第一次上线。');
  if (state.endingStarted && !state.endingType) notes.push('会话开始倒计时。请在断开前完成交叉验证。');
  return notes.slice(-4);
});
const lockedReasons = computed<Partial<Record<ViewId, string>>>(() => ({
  scanner: state.terminalUnlocked ? '' : '检测仪尚未开放',
  devotees: state.triggeredHotspots['eye-left'] ? '' : '需要先在美图中找到粉丝编号',
  boutique: state.sideQuests.eye094Confirmed ? '' : '需要先确认 094 的粉丝状态',
  v1: state.v1Unlocked ? '' : '入口未暴露',
}));
const onlineCount = computed(() => {
  if (state.endingType) return 1;
  if (state.terminalUnlocked) return [47, 23, 9, 4, 1][onlineTick.value % 5];
  return 214 + (onlineTick.value % 6) * 7;
});
const strawberryHarvested = computed(() => state.sideQuests.donorRoom);
const currentEnding = computed(() => state.endingType ? endingContent[state.endingType] : null);

onMounted(() => {
  onlineTimer = window.setInterval(() => {
    onlineTick.value += 1;
  }, 900);
  window.addEventListener('contextmenu', openContextMenu);
  window.addEventListener('click', closeContextMenu);
  if (state.endingStarted && !state.endingType) {
    startCountdown();
  }
});

onUnmounted(() => {
  window.clearInterval(onlineTimer);
  window.clearInterval(countdownTimer);
  window.removeEventListener('contextmenu', openContextMenu);
  window.removeEventListener('click', closeContextMenu);
});

watch(
  [state, terminalHistory],
  () => {
    persistState();
  },
  { deep: true },
);

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, terminalHistory: terminalHistory.value }));
}

function readSavedState(): GameState {
  const fallback: GameState = {
    triggeredHotspots: {},
    mirroredPhotoIds: [],
    zoomedProducts: [],
    terminalUnlocked: false,
    sideQuests: {
      verify: false,
      v1: false,
      sleepFormula: false,
      donorRoom: false,
      handFile: false,
      eyeFile: false,
      eye094Confirmed: false,
      handBuyerConfirmed: false,
      donorB2Confirmed: false,
    },
    v1Unlocked: false,
    invalidTerminalInputs: 0,
    weights: { eye: 0, heart: 0, skin: 0, voice: 0 },
    endingStarted: false,
    endingType: null,
    terminalHistory: [
      {
        kind: 'system',
        text: 'Æ100 SUPPORT SITE // 周边防伪码查询已开放',
      },
    ],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return {
      ...fallback,
      ...parsed,
      sideQuests: { ...fallback.sideQuests, ...(parsed.sideQuests ?? {}) },
      weights: { ...fallback.weights, ...(parsed.weights ?? {}) },
      terminalHistory: parsed.terminalHistory?.length ? parsed.terminalHistory : fallback.terminalHistory,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return fallback;
  }
}

function setView(nextView: ViewId) {
  const lockedReason = lockedReasons.value[nextView];
  if (lockedReason) {
    terminalHistory.value.push({ kind: 'error', text: `镜像站拒绝跳转：${lockedReason}。` });
    persistState();
    return;
  }
  view.value = nextView;
  if (nextView === 'v1') {
    state.v1Unlocked = true;
    state.sideQuests.v1 = true;
    history.replaceState(null, '', './v1');
  } else if (window.location.pathname.endsWith('/v1')) {
    history.replaceState(null, '', './');
  }

  if (nextView === 'devotees') {
    addWeight('voice', 2);
  }
  persistState();
}

function addWeight(kind: OrganKey, value: number) {
  state.weights[kind] += value;
}

function revealHotspot(payload: { id: string; code: string; organ: OrganKey; weight: number }) {
  state.triggeredHotspots[payload.id] = true;
  addWeight(payload.organ, payload.weight);
  if (payload.code === '/v1') {
    state.v1Unlocked = true;
  }
}

function toggleMirror(photoId: string) {
  contextMenu.open = false;
  const hasPhoto = state.mirroredPhotoIds.includes(photoId);
  state.mirroredPhotoIds = hasPhoto
    ? state.mirroredPhotoIds.filter((id) => id !== photoId)
    : [...state.mirroredPhotoIds, photoId];
  addWeight('skin', 10);
}

function zoomProduct(productId: string) {
  if (!state.zoomedProducts.includes(productId)) {
    state.zoomedProducts = [...state.zoomedProducts, productId];
    addWeight('skin', 5);
  }
  if (productId === 'hand-cast' && state.triggeredHotspots['hand-right']) {
    state.sideQuests.handBuyerConfirmed = true;
  }
  if (productId === 'vip' && state.triggeredHotspots.mouth) {
    state.sideQuests.donorB2Confirmed = true;
  }
}

function openSleepFormula() {
  state.sideQuests.sleepFormula = true;
  setView('boutique');
}

function submitTerminal() {
  const command = terminalInput.value.trim();
  if (!command) return;
  terminalHistory.value.push({ kind: 'input', text: `> ${command}` });
  terminalInput.value = '';

  if (command.length < 3) {
    return pushInvalid();
  }

  if (command === 'BLD-O-NEG-0412') {
    state.terminalUnlocked = true;
    state.endingStarted = true;
    terminalHistory.value.push({
      kind: 'alert',
      text: terminalCommands[command],
    });
    terminalHistory.value.push({
      kind: 'system',
      text: '站内检索更新：QUERY:VERIFY 被加入推荐词。会话将在采样完成后断开。',
    });
    persistState();
    startCountdown();
    return;
  }

  const lockedCommand = ['QUERY:VERIFY', 'BLD-O-POS-0307', 'BLD-A-NEG-0519', 'DONOR-PREP-ROOM-03'].includes(command);
  if (lockedCommand && !state.terminalUnlocked) {
    return pushInvalid();
  }

  if (terminalCommands[command]) {
    handleKnownCommand(command);
    return;
  }

  pushInvalid();
}

function handleKnownCommand(command: string) {
  const gateMessage = verifyCrossPageGate(command);
  if (gateMessage) {
    terminalHistory.value.push({ kind: 'error', text: gateMessage });
    persistState();
    return;
  }

  terminalHistory.value.push({ kind: 'output', text: terminalCommands[command] });
  if (command === 'QUERY:VERIFY') state.sideQuests.verify = true;
  if (command === 'DONOR-PREP-ROOM-03') {
    state.sideQuests.donorRoom = true;
    addWeight('voice', 15);
  }
  if (command === 'H-042') state.sideQuests.handFile = true;
  if (command === 'EYE-094') state.sideQuests.eyeFile = true;
  if (command.includes('Succinyl') || command.includes('Tetrodotoxinum')) {
    state.sideQuests.sleepFormula = true;
  }
  persistState();
}

function verifyCrossPageGate(command: string) {
  if (command === 'EYE-094' && !state.sideQuests.eye094Confirmed) {
    return '检索被折叠：094 需要先在粉丝榜中确认。';
  }
  if (command === 'H-042' && !state.sideQuests.handBuyerConfirmed) {
    return '检索被折叠：H-042 需要同时出现在美图挂饰和定制手模备注中。';
  }
  if (command === 'DONOR-PREP-ROOM-03' && !state.sideQuests.donorB2Confirmed) {
    return '检索被折叠：房间号缺少楼层。VIP 邀请函封蜡图案里有后台标注。';
  }
  return '';
}

function pushInvalid() {
  state.invalidTerminalInputs += 1;
  addWeight('heart', 1);
  terminalHistory.value.push({
    kind: 'error',
    text:
      state.invalidTerminalInputs > 9
        ? '检索失败。旧站索引反复指向“商品标签”。'
        : '检索失败。该词不在应援站公开目录中。',
  });
  persistState();
}

function startCountdown() {
  if (state.endingType) return;
  window.clearInterval(countdownTimer);
  countdown.value = countdownSeconds;
  countdownTimer = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      window.clearInterval(countdownTimer);
      finishEnding();
    }
  }, 1000);
}

function finishEnding() {
  const priority: OrganKey[] = ['eye', 'heart', 'skin', 'voice'];
  const winner = priority.reduce<OrganKey>((best, key) => {
    if (state.weights[key] > state.weights[best]) return key;
    return best;
  }, 'eye');
  state.endingType = winner;
  view.value = 'ending';
  document.title = endingContent[winner].title;
}

function openContextMenu(event: MouseEvent) {
  event.preventDefault();
  const target = event.target as HTMLElement;
  const photoId = target.closest<HTMLElement>('[data-photo-id]')?.dataset.photoId ?? '';
  contextMenu.open = true;
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;
  contextMenu.photoId = photoId;
  contextMenu.targetLabel = photoId ? `IMAGE://${photoId}` : 'PAGE-CAPTURE';
}

function closeContextMenu() {
  contextMenu.open = false;
}

function saveShadowCopy() {
  contextMenu.open = false;
  const content = [
    'Project-Æ saved image shadow copy',
    `target=${contextMenu.targetLabel}`,
    `visitor_weight=${JSON.stringify(state.weights)}`,
    'note=副本并不包含原图。原图包含你。',
  ].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ae-shadow-${Date.now()}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function requestContact() {
  contextMenu.open = false;
  const referrer = window.prompt('请输入推荐人编号');
  if (referrer === '#094' || referrer === '094') {
    terminalHistory.value.push({ kind: 'alert', text: '接触许可已记录：Harvested referrer accepted. /v1 已暴露。' });
    state.v1Unlocked = true;
  } else if (referrer) {
    terminalHistory.value.push({ kind: 'error', text: '权限不足。推荐人仍需完成采样。' });
  }
}
</script>

<template>
  <div class="app-shell" :class="{ 'is-ending': view === 'ending', 'is-breached': state.terminalUnlocked }">
    <aside class="sidebar" aria-label="Project-Æ navigation">
      <button class="brand-mark" type="button" @click="setView('gallery')">Æ</button>
      <nav class="nav-stack">
        <button
          v-for="item in visibleNavItems"
          :key="item.id"
          class="nav-tab"
          :class="{ active: view === item.id, locked: Boolean(lockedReasons[item.id]) }"
          type="button"
          @click="setView(item.id)"
          :title="lockedReasons[item.id] || ''"
        >
          <strong>{{ item.code }}</strong>
          <span>{{ item.label }}</span>
        </button>
      </nav>
      <p class="footer-sigil">perfect descent</p>
    </aside>

    <main class="main-frame">
      <header class="topbar">
        <form class="terminal-form" @submit.prevent="submitTerminal">
          <span class="terminal-prefix">Æ&gt;</span>
          <input
            ref="terminalRef"
            v-model="terminalInput"
            aria-label="终端查询"
            autocomplete="off"
          placeholder="输入周边防伪码 / 站内关键词"
            @keydown.delete="addWeight('heart', 1)"
          />
        </form>
        <div class="online-counter">ONLINE {{ onlineCount.toString().padStart(3, '0') }}</div>
        <div v-if="state.endingStarted && !state.endingType" class="countdown">DISCONNECT {{ countdown }}</div>
        <button v-if="TEST_MODE && state.endingStarted && !state.endingType" class="test-finish" type="button" @click="finishEnding">
          finish sampling
        </button>
      </header>

      <section class="terminal-log" aria-label="终端输出">
        <p v-for="(entry, index) in terminalHistory.slice(-5)" :key="`${entry.text}-${index}`" :class="`log-${entry.kind}`">
          {{ entry.text }}
        </p>
      </section>

      <aside class="case-notes" aria-label="案件记录">
        <strong>巡查便笺</strong>
        <p v-for="note in caseNotes" :key="note">{{ note }}</p>
      </aside>

      <GalleryView
        v-if="view === 'gallery'"
        data-view="gallery"
        :triggered-hotspots="state.triggeredHotspots"
        :mirrored-photo-ids="state.mirroredPhotoIds"
        @reveal-hotspot="revealHotspot"
      />
      <ScannerView v-else-if="view === 'scanner'" data-view="scanner" :locked="Boolean(state.endingType)" />
      <DevoteesView
        v-else-if="view === 'devotees'"
        data-view="devotees"
        :devotees="devotees"
        :strawberry-harvested="strawberryHarvested"
        :eye-confirmed="state.sideQuests.eye094Confirmed"
        @confirm-eye-094="state.sideQuests.eye094Confirmed = true"
        @open-sleep-formula="openSleepFormula"
      />
      <BoutiqueView
        v-else-if="view === 'boutique'"
        data-view="boutique"
        :zoomed-products="state.zoomedProducts"
        :show-sleep-formula="state.sideQuests.sleepFormula"
        :hand-unlocked="state.triggeredHotspots['hand-right']"
        :donor-room-unlocked="state.triggeredHotspots.mouth"
        :hand-buyer-confirmed="state.sideQuests.handBuyerConfirmed"
        :donor-b2-confirmed="state.sideQuests.donorB2Confirmed"
        @zoom-product="zoomProduct"
        @open-sleep-formula="openSleepFormula"
      />
      <V1ArchiveView v-else-if="view === 'v1'" data-view="v1" />
      <EndingView v-else-if="view === 'ending' && currentEnding" data-view="ending" :ending="currentEnding" :weights="state.weights" />
    </main>

    <div
      v-if="contextMenu.open"
      class="context-menu"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      @click.stop
    >
      <button type="button" @click="saveShadowCopy">保存影像副本</button>
      <button type="button" :disabled="!contextMenu.photoId" @click="toggleMirror(contextMenu.photoId)">镜像翻转</button>
      <button type="button" @click="requestContact">申请接触许可</button>
    </div>
  </div>
</template>
