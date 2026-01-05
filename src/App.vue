<script setup>
import Features from "./components/Features.vue";
import Footer from "./components/Footer.vue";
import Hero from "./components/Hero.vue";
import Highlights from "./components/Highlights.vue";
import Navbar from "./components/Navbar.vue";
import Performance from "./components/Performance.vue";
import ProductViewer from "./components/ProductViewer.vue";
import Showcase from "./components/Showcase.vue";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
</script>

<template>
  <main>
    <Navbar />
    <Hero />
    <ProductViewer />
    <Showcase />
    <Performance />
    <Features />
    <Highlights />
    <Footer />
  </main>
</template>

<style scoped></style>
