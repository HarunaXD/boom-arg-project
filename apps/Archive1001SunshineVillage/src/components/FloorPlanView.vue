<script setup lang="ts">
import { computed, watch } from 'vue';
import type { EvidenceRecord } from '../types';

const props = defineProps<{
  inspectedRooms: string[];
  evidenceLog: EvidenceRecord[];
}>();

const emit = defineEmits<{
  back: [];
  unlockSpace: [];
}>();

const spaceEvidence = computed(() => props.evidenceLog.filter((item) => item.type === 'space'));
const evidenceRooms = computed(() => new Set([...props.inspectedRooms, ...spaceEvidence.value.map((item) => item.room)]));
const evidenceCount = computed(() => evidenceRooms.value.size);

watch(
  evidenceCount,
  () => {
    if (evidenceCount.value >= 2) {
      emit('unlockSpace');
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回</button>
      <span>一期交房户型平面图 - 扫描件</span>
    </div>
    <div class="floorplan">
      <div class="room" :class="{ marked: evidenceRooms.has('302') }">302<br />客厅贴井<span v-if="evidenceRooms.has('302')">泡沫垫尺寸异常</span></div>
      <div class="room" :class="{ marked: evidenceRooms.has('402') }">402<br />主卧贴井<span v-if="evidenceRooms.has('402')">床位回退 6cm</span></div>
      <div class="shaft" :class="{ awake: evidenceCount >= 2 }">{{ evidenceCount >= 2 ? '公共井 / 胃井 / 井内侧' : '公共电梯井' }}</div>
      <div class="room" :class="{ marked: evidenceRooms.has('502') }">502<br />衣柜贴井<span v-if="evidenceRooms.has('502')">柜门开合不足</span></div>
      <div class="room" :class="{ marked: evidenceRooms.has('602') }">602<br />次卧贴井<span v-if="evidenceRooms.has('602')">门框位移</span></div>
    </div>
    <p class="plan-note">扫描仪批注：比对记录：{{ evidenceCount }} 处尺寸不一致。</p>
  </section>
</template>
