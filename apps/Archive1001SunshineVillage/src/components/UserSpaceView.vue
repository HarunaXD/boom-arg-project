<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { AttachmentRecord, EvidenceRecord } from '../types';
import { getUserAttachments, getUserHistory, getUserLogs } from '../data/threadDatabase';
import { users } from '../data/users';

const props = defineProps<{
  uid: string;
}>();

const emit = defineEmits<{
  back: [];
  openThread: [threadId: string];
  recordEvidence: [evidence: EvidenceRecord];
  unlockVent: [];
}>();

const profile = computed(() => users[props.uid] ?? users['1001']);
const logs = computed(() => getUserLogs(props.uid));
const history = computed(() => getUserHistory(props.uid));
const visitorDate = new Date().toISOString().slice(0, 10);
const attachments = computed(() => [
  ...getUserAttachments(props.uid),
  {
    id: `visitor-${visitorDate}`,
    fileName: `visitor_${visitorDate}.tmp`,
    time: '未上传',
  },
]);
const brokenAttachment = ref('');
const aggregateResidue = computed(() => {
  if (props.uid !== '334') return '';
  return '历史聚合残留：去我主页 / 封风口 / 别睡熟';
});

function maybeUnlockVent(uid: string) {
  if (uid === '334') {
    emit('recordEvidence', {
      type: 'awake',
      sourceThreadId: 'user-334',
      sourcePostId: 'history-aggregate',
      uid: '334',
      room: '未知',
      time: '2003-08-14 00:07',
      label: 'UID 334 历史聚合残留',
    });
    emit('unlockVent');
  }
}

function openAttachment(attachment: AttachmentRecord) {
  brokenAttachment.value = `${attachment.fileName} -> 404 Not Found`;
  if (attachment.evidence) {
    emit('recordEvidence', attachment.evidence);
  }
}

onMounted(() => maybeUnlockVent(props.uid));
watch(() => props.uid, maybeUnlockVent);
</script>

<template>
  <section class="panel user-space">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回</button>
      <span>UID {{ profile.uid }} - {{ profile.name }} - 个人空间</span>
    </div>

    <div class="user-space-grid">
      <aside class="user-summary">
        <div class="avatar" :class="{ flesh: profile.avatar === 'flesh', broken: profile.avatar === 'broken' }">{{ profile.uid }}</div>
        <b>{{ profile.name }}</b>
        <span>房号：{{ profile.room }}</span>
        <span>注册：{{ profile.registered }}</span>
        <span>最后登录：{{ profile.lastLogin }}</span>
        <p>{{ profile.bio }}</p>
      </aside>

      <div class="user-activity">
        <section v-if="logs.length > 0" class="diary">
          <h2>个人日志</h2>
          <article v-for="log in logs" :key="log.title">
            <h3>{{ log.title }}</h3>
            <small>{{ log.time }}</small>
            <p>{{ log.content }}</p>
          </article>
        </section>

        <section class="diary">
          <h2>发帖历史</h2>
          <p v-if="aggregateResidue" class="history-residue">{{ aggregateResidue }}</p>
          <article v-for="entry in history" :key="`${entry.kind}-${entry.threadId}-${entry.floor}-${entry.time}`" class="history-entry">
            <button type="button" class="linklike" @click="emit('openThread', entry.threadId)">
              {{ entry.threadTitle }}
            </button>
            <small>
              {{ entry.kind === 'reply' ? `楼中楼回复 / 第 ${entry.replyToFloor} 楼` : `主楼 / 第 ${entry.floor} 楼` }}
              | {{ entry.time }}
            </small>
            <p>{{ entry.content }}</p>
          </article>
          <p v-if="history.length === 0" class="empty">该用户没有可读历史。字段可能已合并。</p>
        </section>

        <section v-if="attachments.length > 0" class="diary attachment-list">
          <h2>相册 / 附件</h2>
          <button v-for="attachment in attachments" :key="attachment.id" type="button" class="attachment-link" @click="openAttachment(attachment)">
            {{ attachment.time }} / {{ attachment.fileName }}
          </button>
          <p v-if="brokenAttachment" class="db-error">{{ brokenAttachment }}</p>
        </section>
      </div>
    </div>
  </section>
</template>
