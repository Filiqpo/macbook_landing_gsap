<script setup>
import { useMediaQuery } from "@vueuse/core";
import { onMounted, onBeforeUnmount, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const isMobile = useMediaQuery("(max-width: 767px)");
const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
const isDesktop = useMediaQuery("(min-width: 1025px)");
const scrollTriggers = ref([]);

const handleVideoError = (e) => {
  console.error("Video failed to load:", e);
};

onMounted(() => {
  if (isDesktop.value) {
    // Desktop: animazione completa con pin
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#showcase",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
      },
    });

    timeline
      .to(".mask img", {
        scale: 1.1,
      })
      .to(".content", {
        opacity: 1,
        y: 0,
        ease: "power1.in",
      });

    scrollTriggers.value.push(timeline.scrollTrigger);
  } else if (isTablet.value) {
    // Tablet: animazione più semplice senza pin
    gsap.fromTo(
      ".mask img",
      { scale: 1 },
      {
        scale: 1.08,
        scrollTrigger: {
          trigger: "#showcase",
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      }
    );

    gsap.fromTo(
      ".content",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".content",
          start: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      }
    );

    scrollTriggers.value = ScrollTrigger.getAll();
  }
});

onBeforeUnmount(() => {
  scrollTriggers.value.forEach((trigger) => {
    if (trigger) trigger.kill();
  });
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<template>
  <section id="showcase">
    <div class="media">
      <video
        src="/videos/game.mp4"
        loop
        muted
        autoplay
        playsinline
        @error="handleVideoError"
      />
      <div class="mask">
        <img src="/mask-logo.svg" alt="Apple logo mask overlay" />
      </div>
    </div>

    <div class="content">
      <div class="wrapper">
        <div class="text-section">
          <h2>Rocket Chip</h2>

          <div class="description">
            <p>
              Introducing
              <span class="text-white">
                M4, the next generation of Apple Silicon
              </span>
              . M4 powers
            </p>
            <p>
              It drives Apple Intelligence on iPad Pro, so you can write, create
              and accomplish more with ease. All in a design that's unbelievably
              thin, light and powerful.
            </p>
            <p>
              A brand new display engine delivers breathtaking precision, color
              accuracy and brightness. A next-gen GPU with hardware-accelerated
              ray tracing brings console-level graphics to your fingertips
            </p>
            <p class="text-primary">Learn more about Apple Intelligence</p>
          </div>
        </div>
        <div class="stats-section">
          <div class="stat-item">
            <p class="stat-label">Up to</p>
            <h3>4x faster</h3>
            <p class="stat-description">pro rendering performance than M2</p>
          </div>
          <div class="stat-item">
            <p class="stat-label">Up to</p>
            <h3>1.5x faster</h3>
            <p class="stat-description">CPU performance than M2</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
