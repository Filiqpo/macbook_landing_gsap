<script setup>
import { ref, onMounted, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  performanceImages,
  performanceImgPositions,
} from "../constants/index.js";

gsap.registerPlugin(ScrollTrigger);

const isMobile = useMediaQuery("(max-width: 1024px)");
const sectionRef = ref(null);

const initAnimations = () => {
  const sectionEl = sectionRef.value;
  if (!sectionEl) return;

  gsap.fromTo(
    ".content p",
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      ease: "power1.out",
      scrollTrigger: {
        trigger: ".content p",
        start: "top bottom",
        end: "top center",
        scrub: true,
        invalidateOnRefresh: true,
      },
    }
  );

  if (isMobile.value) return;

  const tl = gsap.timeline({
    defaults: { duration: 2, ease: "power1.inOut", overwrite: "auto" },
    scrollTrigger: {
      trigger: sectionEl,
      start: "top bottom",
      end: "center center",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  performanceImgPositions.forEach((item) => {
    if (item.id === "p5") return;
    const selector = `.${item.id}`;
    const vars = {};
    if (typeof item.left === "number") vars.left = `${item.left}%`;
    if (typeof item.right === "number") vars.right = `${item.right}%`;
    if (typeof item.bottom === "number") vars.bottom = `${item.bottom}%`;
    if (item.transform) vars.transform = item.transform;
    tl.to(selector, vars, 0);
  });
};

onMounted(() => {
  initAnimations();
});

watch(isMobile, () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  initAnimations();
});
</script>

<template>
  <section id="performance" ref="sectionRef">
    <h2>Next-level graphics performance. Game on.</h2>
    <div class="wrapper">
      <img
        v-for="(item, index) in performanceImages"
        :key="index"
        :src="item.src"
        :class="item.id"
        :alt="item.alt || `Performance Image #${index + 1}`"
      />
    </div>
    <div class="content">
      <p>
        Run graphics-intensive workflows with a responsiveness that keeps up
        with your imagination. The M4 family of chips features a GPU with a
        second-generation hardware-accelerated ray tracing engine that renders
        images faster, so
        <span class="text-white">
          gaming feels more immersive and realistic than ever.
        </span>
        And Dynamic Caching optimizes fast on-chip memory to dramatically
        increase average GPU utilization — driving a huge performance boost for
        the most demanding pro apps and games.
      </p>
    </div>
  </section>
</template>

<style scoped></style>
