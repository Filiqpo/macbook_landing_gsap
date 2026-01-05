<script setup>
import { useMediaQuery } from "@vueuse/core";
import { onMounted } from "vue";
import gsap from "gsap";

const isMobile = useMediaQuery("max-width: 1024px");

onMounted(() => {
  gsap.to(".left-column, .right-column", {
    scrollTrigger: {
      trigger: "#highlights",
      start: isMobile ? "bottom bottom" : "top center",
    },
    y: 0,
    opacity: 1,
    stagger: 0.5,
    duration: 1,
    ease: "power1.inOut",
  });
});
</script>

<template>
  <section id="highlights">
    <h2>There's never been a better time to upgrade.</h2>
    <h3>Here's what you get with the new MacBook Pro.</h3>

    <div class="masonry">
      <div class="left-column">
        <div>
          <img src="/laptop.png" alt="laptop" />
          <p>Fly through demanding tasks up to 9.8x faster.</p>
        </div>
        <div>
          <img src="/sun.png" alt="sun" />
          <p>
            A stunning <br />
            Liquid Retina XDR <br />
            display.
          </p>
        </div>
      </div>
      <div class="right-column">
        <div class="apple-gradient">
          <img src="/ai.png" alt="ai" />
          <p>
            Built for <br />
            <span>Apple Intelligence.</span>
          </p>
        </div>
        <div>
          <img src="/battery.png" alt="battery" />
          <p>
            Up to <span class="green-gradient">14 more hours </span>
            battery life.
            <span class="text-dark-100">(Up to 24 hours total.)</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
