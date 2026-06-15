<script setup lang="ts">
import prototypeImage from '../assets/generated/v1-prototype.png';
</script>

<template>
  <section class="view v1-view" aria-labelledby="v1-title">
    <div class="old-web">
      <h1 id="v1-title">Project-Æ V1.0 Prototype Archive</h1>
      <p><a href="#prototype">prototype_01_scan.jpg</a> | <a href="#notes">lab_notes_deleted.html</a></p>
      <img id="prototype" :src="prototypeImage" alt="Prototype #1 archive scan" />
      <div id="notes" class="old-notes">
        <p><del>细胞排异反应可以通过药物控制。</del></p>
        <p>细胞排异反应无法控制。</p>
        <p>需要更高配合度的载体。</p>
        <p>宗教狂热或偶像崇拜状态下的供体，器官结合率提升至 87%。</p>
        <p>我们需要他们自愿。不，需要他们渴望。</p>
        <small>第二阶段已启动。</small>
      </div>
    </div>
  </section>
</template>
