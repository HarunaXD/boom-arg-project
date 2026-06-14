<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { EvidenceRecord, GameLocks, ThreadPostRecord } from '../types';
import { boardThreads, cafePages, threadPosts } from '../data/threadDatabase';
import ProfileName from './ProfileName.vue';
import PaginationBar from './PaginationBar.vue';

const props = defineProps<{
  threadId: string;
  page: number;
  unlockedPage: number;
  locks: GameLocks;
  wrongMergeInputs: string[];
}>();

const emit = defineEmits<{
  back: [];
  changePage: [page: number];
  inspectUser: [uid: string, room: string];
  openUser: [uid: string];
  openThread: [threadId: string];
  recordEvidence: [evidence: EvidenceRecord];
  wrongMergeInput: [value: string];
  unlockZhao: [];
  finale: [];
}>();

const codeInput = ref('');
const thread = computed(() => boardThreads.find((item) => item.id === props.threadId));
const isDaily = computed(() => props.threadId === 'daily');
const posts = computed<ThreadPostRecord[]>(() => (isDaily.value ? cafePages[props.page - 1] : threadPosts[props.threadId] ?? []));
const maxPage = computed(() => (isDaily.value ? 50 : 1));

watch(
  () => props.threadId,
  (threadId) => {
    if (threadId === 'zhao-final') {
      emit('unlockZhao');
    }
  },
  { immediate: true },
);

function displayUid(uid: string) {
  return props.locks.s3 && uid !== '334' ? '1001' : uid;
}

function displayName(uid: string, name: string) {
  return displayUid(uid) === '1001' && props.locks.s3 ? '1001' : name;
}

function inspectAuthor(uid: string, room: string) {
  emit('inspectUser', uid, room);
}

function openAuthor(uid: string, room: string) {
  emit('inspectUser', uid, room);
  emit('openUser', uid);
}

function inspectPost(item: ThreadPostRecord) {
  emit('inspectUser', item.author.uid, item.author.room);
  if (item.evidence) {
    emit('recordEvidence', item.evidence);
  }
}

function isThreadOwner(item: ThreadPostRecord) {
  return item.author.uid === thread.value?.authorUid;
}

function openQuote(item: ThreadPostRecord) {
  if (item.quoteOf) {
    if (item.evidence) {
      emit('recordEvidence', item.evidence);
    }
    emit('openThread', item.quoteOf.threadId);
  }
}

function recordRevisionEvidence(item: ThreadPostRecord) {
  if (item.evidence) {
    emit('recordEvidence', item.evidence);
  }
}

function submitCode() {
  if (codeInput.value.trim() === '1001') {
    emit('finale');
  } else {
    emit('wrongMergeInput', codeInput.value);
    codeInput.value = '';
  }
}

function dbRow(item: ThreadPostRecord) {
  return `uid=${displayUid(item.author.uid)} room=${props.locks.s3 && item.author.uid !== '334' ? 'all' : item.author.room} floor=${item.floor} archive_id=1001 content=${item.content}`;
}

function officialContent(item: ThreadPostRecord) {
  if (!props.locks.s2 || item.author.uid === '334') return item.content;
  return item.content
    .replaceAll('墙在喘气', '墙体风压变化')
    .replaceAll('墙体回缩', '建材沉降')
    .replaceAll('黄色黏液', '清洁残留')
    .replaceAll('黄黏液', '清洁残留')
    .replaceAll('软软的', '材料弹性正常')
    .replaceAll('往里来了', '视觉误差')
    .replaceAll('墙自己往前蹭', '家具摆放误差');
}
</script>

<template>
  <section class="panel thread-panel">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回版块</button>
      <span>{{ thread?.title ?? '记录不存在' }}</span>
    </div>

    <PaginationBar
      v-if="isDaily"
      :page="page"
      :max-page="maxPage"
      :unlocked-page="unlockedPage"
      @change="emit('changePage', $event)"
    />

    <article
      v-for="item in posts"
      :key="item.id"
      class="post-row"
      :class="{ corrupted: item.flags?.includes('corrupted'), final: locks.s3 && page >= 46 }"
    >
      <aside class="post-author">
        <button
          type="button"
          class="avatar avatar-button"
          :class="{ broken: locks.s2 && Number(item.author.uid) % 3 === 0, flesh: locks.s3 && item.author.uid !== '334' }"
          @click="inspectPost(item); openAuthor(item.author.uid, item.author.room)"
        >
          {{ displayUid(item.author.uid) }}
        </button>
        <ProfileName
          :uid="item.author.uid"
          :locks="locks"
          @inspect="inspectAuthor"
          @open-user="emit('openUser', $event)"
        />
        <span v-if="isThreadOwner(item)" class="owner-badge">楼主</span>
        <small>UID {{ displayUid(item.author.uid) }}</small>
      </aside>
      <div class="post-content">
        <div class="post-meta">第 {{ item.floor }} 楼 | {{ locks.s3 && page >= 46 ? '--:--' : item.time }}</div>
        <div v-if="item.quoteOf" class="quote-ref">
          <button type="button" class="linklike" @click="openQuote(item)">引用自 {{ item.quoteOf.label }}</button>
        </div>
        <p v-if="locks.s3 && page >= 46" class="db-row">{{ dbRow(item) }}</p>
        <p v-else>{{ officialContent(item) }}</p>
        <div v-if="item.revisionOf" class="revision-ref">
          <button type="button" class="linklike" @click="recordRevisionEvidence(item)">
            查看 {{ item.revisionOf.label }}
          </button>
          <p>{{ item.revisionOf.before }}</p>
        </div>
        <div v-else-if="item.evidence" class="evidence-ref">
          <button type="button" class="linklike" @click="emit('recordEvidence', item.evidence)">
            缓存字段：{{ item.evidence.label }}
          </button>
        </div>
        <div v-if="item.attachmentIds?.length" class="attachment-ref">
          <span v-for="attachmentId in item.attachmentIds" :key="attachmentId">{{ attachmentId }} - 404</span>
        </div>

        <div v-if="item.replies.length > 0" class="floor-replies">
          <div v-for="reply in item.replies" :key="reply.id" class="floor-reply">
            <button type="button" class="reply-author" @click="openAuthor(reply.author.uid, reply.author.room)">
              {{ displayName(reply.author.uid, reply.author.name) }}
            </button>
            <span class="reply-time">{{ locks.s3 && page >= 46 ? '--:--' : reply.time }}</span>
            <p>{{ reply.content }}</p>
          </div>
        </div>
      </div>
    </article>

    <div v-if="isDaily && page === 15 && !locks.s1" class="db-error">
      数据库错误：请从记录中寻找“老赵”。
    </div>

    <article v-for="(input, index) in wrongMergeInputs" :key="`merge-input-${index}-${input}`" class="post-row final archive-echo">
      <div class="post-content">
        <div class="post-meta">第 {{ 1001 + index }} 楼 | --:--</div>
        <p>merge_target 接收到“{{ input }}”。字段未匹配，内容转入 UID 1001 临时回复。</p>
      </div>
    </article>
    <div v-if="isDaily && page === 30 && !locks.s2" class="db-error">
      数据库错误：room_width 字段异常。请比对住户房号和户型图。
    </div>
    <div v-if="isDaily && page === 45 && !locks.s3" class="db-error">
      数据库错误：仍有清醒用户未归档。
    </div>

    <form v-if="isDaily && page === 50 && locks.s3" class="archive-code" @submit.prevent="submitCode">
      <label for="archive-code">merge_target = ____</label>
      <input id="archive-code" v-model="codeInput" autocomplete="off" inputmode="numeric" />
      <button type="submit">确认</button>
    </form>

    <PaginationBar
      v-if="isDaily"
      :page="page"
      :max-page="maxPage"
      :unlocked-page="unlockedPage"
      @change="emit('changePage', $event)"
    />
  </section>
</template>
