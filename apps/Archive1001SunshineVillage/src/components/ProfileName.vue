<script setup lang="ts">
import { computed } from 'vue';
import type { GameLocks } from '../types';
import { evidenceRooms, users } from '../data/users';

const props = defineProps<{
  uid: string;
  locks: GameLocks;
}>();

const emit = defineEmits<{
  inspect: [uid: string, room: string];
  openUser: [uid: string];
}>();

const profile = users[props.uid] ?? users['1001'];
const displayUid = computed(() => (props.locks.s3 && props.uid !== '334' ? '1001' : props.uid));
const dynamicName = computed(() => (displayUid.value === '1001' && props.locks.s3 ? '1001' : profile.name));
const formerRooms = computed(() => {
  if (!props.locks.s2) return '';
  if (['101', '142'].includes(props.uid)) return '101 / 402';
  if (['078', '177'].includes(props.uid)) return '602 / 101';
  if (props.uid === '334') return '未知 / 井内侧';
  return '';
});

function inspect() {
  emit('inspect', props.uid, profile.room);
}

function openProfile() {
  emit('inspect', props.uid, profile.room);
  emit('openUser', props.uid);
}
</script>

<template>
  <span class="profile-name" tabindex="0" @click="openProfile" @keydown.enter="openProfile" @mouseenter="inspect" @focus="inspect">
    {{ dynamicName }}
    <span class="profile-card">
      <b>{{ dynamicName }}</b>
      <span>UID: {{ displayUid }}</span>
      <span>房号: {{ profile.room }}</span>
      <span v-if="formerRooms">曾用房号: {{ formerRooms }}</span>
      <span>注册: {{ profile.registered }}</span>
      <span>最后登录: {{ locks.s2 && evidenceRooms.has(profile.room) ? '2003-08-14 00:00' : profile.lastLogin }}</span>
      <span v-if="locks.s3">查看者房号: 未分配</span>
      <span v-if="locks.s3">查看者最后登录: 2003-08-14 03:02</span>
      <span class="bio">{{ locks.s3 && props.uid !== '334' ? '字段合并中，原始资料不可读。' : profile.bio }}</span>
      <button type="button" @click.stop="openProfile">访问主页</button>
    </span>
  </span>
</template>
