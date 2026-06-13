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

function inspect() {
  emit('inspect', props.uid, profile.room);
}
</script>

<template>
  <span class="profile-name" tabindex="0" @click="inspect" @keydown.enter="inspect">
    {{ dynamicName }}
    <span class="profile-card">
      <b>{{ dynamicName }}</b>
      <span>UID: {{ displayUid }}</span>
      <span>房号: {{ profile.room }}</span>
      <span>注册: {{ profile.registered }}</span>
      <span>最后登录: {{ locks.s2 && evidenceRooms.has(profile.room) ? '2003-08-14 00:00' : profile.lastLogin }}</span>
      <span class="bio">{{ locks.s3 && props.uid !== '334' ? '字段合并中，原始资料不可读。' : profile.bio }}</span>
      <button v-if="props.uid === '334'" type="button" @click.stop="emit('openUser', props.uid)">访问主页</button>
    </span>
  </span>
</template>
