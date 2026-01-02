<script setup>
import { onMounted, ref } from "vue";

const videoRef = ref(null);

onMounted(() => {});
</script>

<template>
  <section id="hero">
    <div>
      <h1>MacBook Pro</h1>
      <img src="/title.png" alt="MacBook Title" />
    </div>

    <video :ref="videoRef" src="/videos/hero.mp4" autoplay muted playsinline />
    <button>Buy</button>
    <p>From $1599 or $133/mo for 12 months</p>
  </section>
</template>

<style scoped></style>
