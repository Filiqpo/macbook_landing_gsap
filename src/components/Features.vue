<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useMediaQuery } from "@vueuse/core";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { features, featureSequence } from "../constants/index.js";
import { useMacbookStore } from "../store/index.js";

gsap.registerPlugin(ScrollTrigger);

const isMobile = useMediaQuery("(max-width: 1024px)");
const canvasRef = ref(null);
const macbookStore = useMacbookStore();
const createdTriggers = [];
let modelReadyPromise;

let scene, camera, renderer, model, groupRef;
let animationFrameId;
let currentVideoTexture = null;
let currentVideo = null;
let screenMesh = null;
let handleResize;

const preloadVideos = () => {
  featureSequence.forEach((feature) => {
    const v = document.createElement("video");
    Object.assign(v, {
      src: feature.videoPath,
      muted: true,
      playsInline: true,
      preload: "auto",
      crossOrigin: "anonymous",
    });
    v.load();
  });
};

const setupScene = () => {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    canvasRef.value.clientWidth / canvasRef.value.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvasRef.value,
  });
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;

  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight2.position.set(-5, 5, -5);
  scene.add(directionalLight2);

  const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight3.position.set(0, 0, 10);
  scene.add(directionalLight3);

  const leftRimLight = new THREE.DirectionalLight(0x6699ff, 1);
  leftRimLight.position.set(-10, 2, 0);
  scene.add(leftRimLight);

  const rightRimLight = new THREE.DirectionalLight(0xff9966, 1);
  rightRimLight.position.set(10, 2, 0);
  scene.add(rightRimLight);

  const bottomLight = new THREE.DirectionalLight(0xffffff, 0.8);
  bottomLight.position.set(0, -5, 0);
  scene.add(bottomLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  groupRef = new THREE.Group();
  scene.add(groupRef);

  modelReadyPromise = loadModel();

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  handleResize = () => {
    if (!canvasRef.value) return;
    camera.aspect = canvasRef.value.clientWidth / canvasRef.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight);
  };
  window.addEventListener("resize", handleResize);
};

const loadModel = () => {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    dracoLoader.setDecoderConfig({ type: "js" });

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const modelPath = "/models/macbook-transformed.glb";

    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        const scale = isMobile.value ? 0.05 : 0.08;
        model.scale.set(scale, scale, scale);
        model.position.set(0, -1, 0);

        groupRef.add(model);

        findScreenMesh();

        if (screenMesh) {
          updateModelTexture("/videos/feature-1.mp4");
        }

        console.log("✅ Model loaded successfully");
        resolve();
      },
      (progress) => {
        console.log(
          "📦 Loading:",
          Math.round((progress.loaded / progress.total) * 100) + "%"
        );
      },
      (error) => {
        console.error("❌ Error loading model:", error);
        reject(error);
      }
    );
  });
};

const findScreenMesh = () => {
  if (!model) return;

  console.log("🔍 Searching for screen mesh...");

  model.traverse((child) => {
    if (child.isMesh) {
      console.log(`Found mesh: ${child.name}`);

      if (
        child.name === "Object_123" ||
        child.name.toLowerCase().includes("screen") ||
        child.name.toLowerCase().includes("display") ||
        child.name === "screen" ||
        child.name === "Screen"
      ) {
        screenMesh = child;
        console.log("✅ Screen mesh found:", child.name);
      }
    }
  });

  if (!screenMesh) {
    console.warn("⚠️ Screen mesh not found!");
  }
};

const createVideoElement = (src) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = src;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.setAttribute("webkit-playsinline", "true");

    video.addEventListener(
      "canplay",
      () => {
        video
          .play()
          .then(() => {
            console.log("✅ Video ready and playing:", src);
            resolve(video);
          })
          .catch((err) => {
            console.error("❌ Video play error:", err);
            resolve(video);
          });
      },
      { once: true }
    );

    setTimeout(() => {
      if (video.readyState < 2) {
        console.warn("⚠️ Video loading timeout, proceeding anyway");
        resolve(video);
      }
    }, 3000);

    video.load();
  });
};

const updateModelTexture = async (videoPath) => {
  if (!screenMesh) {
    console.warn("⚠️ Cannot update texture: screen mesh not found");
    return;
  }

  console.log("🎬 Updating texture to:", videoPath);

  if (currentVideo) {
    currentVideo.pause();
    currentVideo.src = "";
  }

  if (currentVideoTexture) {
    currentVideoTexture.dispose();
  }

  currentVideo = await createVideoElement(videoPath);

  currentVideoTexture = new THREE.VideoTexture(currentVideo);
  currentVideoTexture.colorSpace = THREE.SRGBColorSpace;
  currentVideoTexture.minFilter = THREE.LinearFilter;
  currentVideoTexture.magFilter = THREE.LinearFilter;
  currentVideoTexture.format = THREE.RGBAFormat;
  currentVideoTexture.needsUpdate = true;

  const screenMaterial = new THREE.MeshBasicMaterial({
    map: currentVideoTexture,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  screenMesh.material = screenMaterial;

  console.log("✅ Texture applied to screen");
};

const setupAnimations = () => {
  if (!groupRef) {
    console.warn("groupRef not initialized");
    return;
  }

  const modelTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#f-canvas",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: true,
    },
  });
  createdTriggers.push(modelTimeline.scrollTrigger);

  // 3D SPIN
  modelTimeline.to(groupRef.rotation, {
    y: Math.PI * 2,
    ease: "power1.inOut",
  });

  // SYNC THE FEATURE CONTENT
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#f-canvas",
      start: "top center",
      end: "bottom top",
      scrub: 1,
    },
  });
  createdTriggers.push(timeline.scrollTrigger);

  // Content & Texture Sync
  timeline
    .call(() => {
      updateModelTexture("/videos/feature-1.mp4");
    })
    .to(".box1", { opacity: 1, y: 0, delay: 1 })
    .call(() => {
      updateModelTexture("/videos/feature-2.mp4");
    })
    .to(".box2", { opacity: 1, y: 0 })
    .call(() => {
      updateModelTexture("/videos/feature-3.mp4");
    })
    .to(".box3", { opacity: 1, y: 0 })
    .call(() => {
      updateModelTexture("/videos/feature-4.mp4");
    })
    .to(".box4", { opacity: 1, y: 0 })
    .call(() => {
      updateModelTexture("/videos/feature-5.mp4");
    })
    .to(".box5", { opacity: 1, y: 0 });
};

onMounted(() => {
  preloadVideos();
  setupScene();

  if (modelReadyPromise) {
    modelReadyPromise
      .then(() => {
        if (screenMesh) {
          setupAnimations();
        } else {
          console.error("❌ Cannot setup animations: screen mesh not found");
        }
      })
      .catch((err) => {
        console.error("❌ Error loading model for animations:", err);
      });
  } else {
    console.warn("⚠️ modelReadyPromise not set; skipping animation setup");
  }
});

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (currentVideo) {
    currentVideo.pause();
    currentVideo.src = "";
    currentVideo = null;
  }

  if (currentVideoTexture) {
    currentVideoTexture.dispose();
    currentVideoTexture = null;
  }

  createdTriggers.forEach((trigger) => {
    if (trigger) trigger.kill();
  });
  createdTriggers.length = 0;

  if (renderer) {
    renderer.dispose();
  }

  if (model) {
    model.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <section id="features">
    <h2>See it all in a new light.</h2>
    <canvas ref="canvasRef" id="f-canvas"></canvas>

    <div class="absolute inset-0">
      <div
        v-for="(feature, index) in features"
        :key="feature.id"
        :class="['box', `box${index + 1}`, feature.styles]"
      >
        <img :src="feature.icon" :alt="feature.highlight" />
        <p>
          <span class="text-white">{{ feature.highlight }}</span>
          {{ feature.text }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
