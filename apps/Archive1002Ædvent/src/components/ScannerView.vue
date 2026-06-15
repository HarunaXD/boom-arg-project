<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ locked: boolean }>();

const scanning = ref(false);
const result = ref('等待样本靠近镜头。');

function startScan() {
  scanning.value = true;
  const results = [
    '虹膜匹配度: 99.7%',
    '喉部微振动: 已记录',
    '表皮反光: 可复刻',
    '心率估算: 高于静息水平',
  ];
  result.value = results[Math.floor(Math.random() * results.length)];
}
</script>

<template>
  <section class="view scanner-view" aria-labelledby="scanner-title">
    <div class="view-heading">
      <p>Æ-Scanner / 降临测试仪</p>
      <h1 id="scanner-title">检测你的可替换性</h1>
    </div>

    <div class="scanner-machine" :class="{ scanning, locked }">
      <div class="scanner-screen">
        <span class="crosshair horizontal"></span>
        <span class="crosshair vertical"></span>
        <span class="target-dot"></span>
      </div>
      <div class="scanner-readout">
        <p>{{ locked ? '准星已锁定。请勿移动。' : result }}</p>
        <button type="button" @click="startScan">开始扫描</button>
      </div>
    </div>
  </section>
</template>
