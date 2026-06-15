<script setup lang="ts">
import { products } from '../data/gameData';

defineProps<{
  zoomedProducts: string[];
  showSleepFormula: boolean;
  handUnlocked?: boolean;
  donorRoomUnlocked?: boolean;
  handBuyerConfirmed?: boolean;
  donorB2Confirmed?: boolean;
}>();

const emit = defineEmits<{
  zoomProduct: [productId: string];
  openSleepFormula: [];
}>();
</script>

<template>
  <section class="view boutique-view" aria-labelledby="boutique-title">
    <div class="view-heading">
      <p>Æ-Boutique / 信徒黑市</p>
      <h1 id="boutique-title">所有商品都有防伪码，所有防伪码都有体温</h1>
    </div>

    <div v-if="showSleepFormula" class="sleep-formula">
      <h2>隐藏商品：Æ的临睡圣礼套装</h2>
      <p>让她触碰你之前，先让你的身体安静下来。睡前涂抹，保持静止。</p>
      <p class="latin">Succinylcholinum Chloride // Tetrodotoxinum Purificatum</p>
    </div>

    <div class="product-grid">
      <article v-for="product in products" :key="product.id" class="product-card" :class="{ zoomed: zoomedProducts.includes(product.id) }">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
          <span class="micro-text">{{ product.clue }}</span>
        </div>
        <div class="product-copy">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <div class="product-meta">
            <span>{{ product.price }} pts</span>
            <span>{{ product.sold }}</span>
          </div>
          <p v-if="product.id === 'hand-cast' && handUnlocked" class="buyer-note">
            购买者备注：#094
            <span v-if="handBuyerConfirmed"> // H-042 已互证</span>
          </p>
          <p v-if="product.id === 'vip' && donorRoomUnlocked" class="buyer-note">
            封蜡平面图：B2 / DONOR WING
            <span v-if="donorB2Confirmed"> // ROOM-03 已补全楼层</span>
          </p>
          <button type="button" @click="emit('zoomProduct', product.id)">放大检查</button>
          <button v-if="product.id === 'sleep-kit'" type="button" @click="emit('openSleepFormula')">查看隐藏详情</button>
        </div>
      </article>
    </div>
  </section>
</template>
