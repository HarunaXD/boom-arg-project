<script setup lang="ts">
import { ref } from 'vue';
import { galleryPhotos } from '../data/gameData';
import type { GalleryHotspot } from '../types';

defineProps<{
  triggeredHotspots: Record<string, boolean>;
  mirroredPhotoIds: string[];
}>();

const emit = defineEmits<{
  revealHotspot: [{ id: string; code: string; organ: GalleryHotspot['organ']; weight: number }];
}>();

const revealText = ref('');
const timers = new Map<string, number>();

function beginReveal(hotspot: GalleryHotspot, mirrored: boolean) {
  if (hotspot.mirrorOnly && !mirrored) {
    revealText.value = '反向文字无法读取。也许该把她翻过来。';
    return;
  }

  const delay = hotspot.id === 'cheek' ? 1600 : 3000;
  timers.set(
    hotspot.id,
    window.setTimeout(() => {
      revealText.value = hotspot.code;
      emit('revealHotspot', {
        id: hotspot.id,
        code: hotspot.code,
        organ: hotspot.organ,
        weight: hotspot.weight,
      });
    }, delay),
  );
}

function cancelReveal(id: string) {
  const timer = timers.get(id);
  if (timer) window.clearTimeout(timer);
  timers.delete(id);
}
</script>

<template>
  <section class="view gallery-view" aria-labelledby="gallery-title">
    <div class="view-heading">
      <p>Æ-Gallery / 圣像陈列室</p>
      <h1 id="gallery-title">凝视直到图片开始回看你</h1>
    </div>

    <div class="photo-grid">
      <article
        v-for="photo in galleryPhotos"
        :key="photo.id"
        class="photo-card"
        :class="[`shape-${photo.shape}`, { mirrored: mirroredPhotoIds.includes(photo.id) }]"
        :data-photo-id="photo.id"
      >
        <div class="photo-frame">
          <img :src="photo.image" :alt="photo.title" draggable="false" />
          <span v-if="photo.id === 'photo-3'" class="qr-charm">H-042</span>
          <span v-if="photo.id === 'photo-2'" class="reverse-code">30-MOOR-PERP-RONOD</span>
          <button
            v-for="hotspot in photo.hotspots"
            :key="hotspot.id"
            class="hotspot"
            :class="{ triggered: triggeredHotspots[hotspot.id] }"
            type="button"
            :aria-label="hotspot.label"
            :style="hotspot.style"
            @mouseenter="beginReveal(hotspot, mirroredPhotoIds.includes(photo.id))"
            @mouseleave="cancelReveal(hotspot.id)"
            @focus="beginReveal(hotspot, mirroredPhotoIds.includes(photo.id))"
            @blur="cancelReveal(hotspot.id)"
          >
            <span>{{ triggeredHotspots[hotspot.id] ? hotspot.code : '' }}</span>
          </button>
        </div>
        <div class="photo-copy">
          <h2>{{ photo.title }}</h2>
          <p>{{ photo.caption }}</p>
        </div>
      </article>
    </div>

    <div class="pixel-drop" aria-live="polite">
      <span v-if="revealText">{{ revealText }}</span>
      <span v-else>悬停她的眼睛、手腕、嘴唇，直到像素掉下来。</span>
    </div>
  </section>
</template>
