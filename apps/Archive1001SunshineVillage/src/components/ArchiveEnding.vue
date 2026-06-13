<script setup lang="ts">
const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <section class="ending-screen">
    <div class="xp-dialog">
      <div class="xp-title">&nbsp;</div>
      <div class="xp-body">
        <p>[系统归档日志 - 2003年8月14日]</p>
        <p>阳光新村一期住户（共302人）已全部完成数据合并。</p>
        <p>建筑消化完毕，进入休眠期。</p>
        <p>等待二期业主入住。</p>
        <button type="button" @click="emit('confirm')">确认</button>
      </div>
    </div>
  </section>
</template>
