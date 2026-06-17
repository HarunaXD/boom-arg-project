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

function isPhotoRevealed(photoId: string, triggeredHotspots: Record<string, boolean>) {
  const photo = galleryPhotos.find((item) => item.id === photoId);
  return Boolean(photo?.hotspots.some((hotspot) => triggeredHotspots[hotspot.id]));
}

function afterimageFor(photoId: string) {
  if (photoId === 'photo-1') return '眼部滤镜剥落：虹膜反光中有束缚带。';
  if (photoId === 'photo-2') return '唇彩下方出现反写房号。';
  if (photoId === 'photo-3') return '手链挂饰短暂变成手术标签。';
  if (photoId === 'photo-5') return '合影里的粉丝脸被噪点抹平。';
  return '照片缓存异常。';
}

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
    <div class="fan-hero">
      <div class="fan-hero-copy">
        <p class="sparkle-line">★ Æ 出道百日应援官网 ★ 2003 SPECIAL MIRROR ★</p>
        <h1 id="gallery-title">今天也要为 Æ 投下漂亮的一票</h1>
        <p>
          高清美图、粉丝榜、限定周边防伪查询同步开放。请把鼠标停在你最喜欢的细节上，
          应援站会记住你的偏爱。
        </p>
      </div>
      <div class="fan-widget">
        <strong>今日应援</strong>
        <span>214 人在线</span>
        <span>相似度活动维护中</span>
        <span>后台见面会名额：5</span>
      </div>
    </div>

    <div class="marquee-strip">
      <span>NEW! Æ 百日限定壁纸公开</span>
      <span>请勿重复提交自拍样本</span>
      <span>094号信徒已完成特别应援</span>
      <span>漂亮的眼睛会被优先展示</span>
    </div>

    <div class="photo-grid">
      <article
        v-for="photo in galleryPhotos"
        :key="photo.id"
        class="photo-card"
        :class="[`shape-${photo.shape}`, { mirrored: mirroredPhotoIds.includes(photo.id), revealed: isPhotoRevealed(photo.id, triggeredHotspots) }]"
        :data-photo-id="photo.id"
      >
        <div class="photo-frame">
          <img :src="photo.image" :alt="photo.title" draggable="false" />
          <span v-if="isPhotoRevealed(photo.id, triggeredHotspots)" class="photo-afterimage">{{ afterimageFor(photo.id) }}</span>
          <span v-if="photo.id === 'photo-1' && triggeredHotspots['eye-left']" class="iris-reflection">TABLE-STRAP // 00:12</span>
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
