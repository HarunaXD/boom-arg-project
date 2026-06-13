<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
  inspectedRooms: string[];
}>();

const emit = defineEmits<{
  back: [];
  unlockSpace: [];
}>();

let timer = 0;
const evidenceCount = computed(() => new Set(props.inspectedRooms).size);

onMounted(() => {
  timer = window.setTimeout(() => {
    if (evidenceCount.value >= 2) {
      emit('unlockSpace');
    }
  }, 5000);
});

onUnmounted(() => {
  window.clearTimeout(timer);
});
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <button type="button" class="linklike" @click="emit('back')">返回</button>
      <span>一期交房户型平面图 - 扫描件</span>
    </div>
    <div class="floorplan">
      <div class="room">302<br />客厅贴井</div>
      <div class="room">402<br />主卧贴井</div>
      <div class="shaft">公共电梯井</div>
      <div class="room">502<br />衣柜贴井</div>
      <div class="room">602<br />次卧贴井</div>
    </div>
    <p class="plan-note">
      已点开 {{ evidenceCount }} 个空间异常住户资料卡。停留五秒后，若证据足够，系统会解除下一段归档。
    </p>
  </section>
</template>
