<script setup lang="ts">
import { computed, ref } from 'vue';
import type { GameLocks, Post } from '../types';
import { boardThreads } from '../data/boards';
import { cafePages, threadPosts } from '../data/posts';
import ProfileName from './ProfileName.vue';
import PaginationBar from './PaginationBar.vue';

const props = defineProps<{
  threadId: string;
  page: number;
  unlockedPage: number;
  locks: GameLocks;
}>();

const emit = defineEmits<{
  back: [];
  changePage: [page: number];
  inspectUser: [uid: string, room: string];
  openUser: [uid: string];
  unlockZhao: [];
  finale: [];
}>();

const codeInput = ref('');
const thread = computed(() => boardThreads.find((item) => item.id === props.threadId));
const isDaily = computed(() => props.threadId === 'daily');
const posts = computed<Post[]>(() => (isDaily.value ? cafePages[props.page - 1] : threadPosts[props.threadId] ?? []));
const maxPage = computed(() => (isDaily.value ? 50 : 1));

function readThread() {
  if (props.threadId === 'zhao-final') {
    emit('unlockZhao');
  }
}

function submitCode() {
  if (codeInput.value.trim() === '1001') {
    emit('finale');
  }
}
</script>

<template>
  <section class="panel thread-panel" @vue:mounted="readThread">
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

    <article v-for="item in posts" :key="item.id" class="post-row" :class="{ corrupted: item.corrupted, final: locks.s3 && page >= 46 }">
      <aside class="post-author">
        <div class="avatar" :class="{ broken: locks.s2 && Number(item.uid) % 3 === 0, flesh: locks.s3 && item.uid !== '334' }">
          {{ locks.s3 && item.uid !== '334' ? '1001' : item.uid }}
        </div>
        <ProfileName
          :uid="item.uid"
          :locks="locks"
          @inspect="(uid, room) => emit('inspectUser', uid, room)"
          @open-user="emit('openUser', $event)"
        />
        <small>UID {{ locks.s3 && item.uid !== '334' ? '1001' : item.uid }}</small>
      </aside>
      <div class="post-content">
        <div class="post-meta">第 {{ item.floor }} 楼 | {{ locks.s3 && page >= 46 ? '--:--' : item.time }}</div>
        <p :class="{ hiddenline: item.hiddenMessage }">{{ item.content }}</p>
        <div v-if="item.hiddenMessage" class="hidden-tip">
          <span>全选后能看到空白里的字：</span>
          <code>{{ item.hiddenMessage }}</code>
        </div>
        <button v-if="item.uid === '334'" type="button" class="inline-action" @click="emit('openUser', item.uid)">
          访问 UID 334 个人空间
        </button>
      </div>
    </article>

    <div v-if="isDaily && page === 15 && !locks.s1" class="db-error">
      数据库错误：请从记录中寻找“老赵”。
    </div>
    <div v-if="isDaily && page === 30 && !locks.s2" class="db-error">
      数据库错误：room_width 字段异常。请比对住户房号和户型图。
    </div>
    <div v-if="isDaily && page === 45 && !locks.s3" class="db-error">
      数据库错误：仍有清醒用户未归档。
    </div>

    <form v-if="isDaily && page === 50 && locks.s3" class="archive-code" @submit.prevent="submitCode">
      <label for="archive-code">输入代号以查看归档报告</label>
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
