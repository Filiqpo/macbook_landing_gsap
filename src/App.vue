<script setup>
import Hero from "./components/Hero.vue";
import Navbar from "./components/Navbar.vue";
import ProductViewer from "./components/ProductViewer.vue";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
</script>

<template>
  <main>
    <Navbar />
    <Hero />
    <ProductViewer />
  </main>
</template>

<style scoped></style>
