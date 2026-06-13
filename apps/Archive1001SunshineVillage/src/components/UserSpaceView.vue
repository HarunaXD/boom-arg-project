<script setup lang="ts">
import { onMounted } from 'vue';
import { userLog334 } from '../data/posts';

const emit = defineEmits<{
  back: [];
  unlockVent: [];
}>();

onMounted(() => {
  emit('unlockVent');
});
</script>

<template>
  <section class="panel user-space">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回</button>
      <span>UID 334 - 失眠的猫 - 个人空间</span>
    </div>
    <article class="diary">
      <h2>{{ userLog334.title }}</h2>
      <p>{{ userLog334.content }}</p>
    </article>
  </section>
</template>
