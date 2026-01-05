<script setup>
import { useMacbookStore } from "../store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const macbookStore = useMacbookStore();
const { color, scale } = storeToRefs(macbookStore);
const canvasRef = ref(null);
let scene, camera, renderer, controls, model;

const handleColorChange = (newColor) => {
  macbookStore.setColor(newColor);
  updateModelColor();
};

const handleSizeChange = (newScale) => {
  macbookStore.setScale(newScale);
  updateModelScale();
};

const updateModelColor = () => {
  if (model) {
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color = new THREE.Color(color.value);
      }
    });
  }
};

const updateModelScale = () => {
  if (model) {
    model.scale.set(scale.value, scale.value, scale.value);
  }
};

onMounted(() => {
  // Setup scene
  scene = new THREE.Scene();

  // Setup camera
  camera = new THREE.PerspectiveCamera(
    50,
    canvasRef.value.clientWidth / canvasRef.value.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 2, 5);

  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  canvasRef.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight2.position.set(-5, 5, -5);
  scene.add(directionalLight2);

  const frontLight = new THREE.DirectionalLight(0xffffff, 1);
  frontLight.position.set(0, 0, 5);
  scene.add(frontLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
  backLight.position.set(-30, 0, -20);
  scene.add(backLight);

  // Setup controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
  );
  dracoLoader.setDecoderConfig({ type: "js" });

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    "/models/macbook-14-transformed.glb",
    (gltf) => {
      model = gltf.scene;
      model.scale.set(scale.value, scale.value, scale.value);
      scene.add(model);
      updateModelColor();
      console.log("Modello caricato con successo!");
    },
    (progress) => {
      console.log(
        "Caricamento:",
        Math.round((progress.loaded / progress.total) * 100) + "%"
      );
    },
    (error) => {
      console.error("Errore caricamento modello:", error);
    }
  );

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // Handle resize
  const handleResize = () => {
    camera.aspect = canvasRef.value.clientWidth / canvasRef.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight);
  };
  window.addEventListener("resize", handleResize);
});
</script>

<template>
  <section id="product-viewer">
    <h2>Take a closer look</h2>
    <div class="controls">
      <p class="info">
        MacBook Pro {{ scale === 0.06 ? '14"' : '16"' }} in
        {{ color === "#adb5bd" ? "Silver" : "Space Black" }}
      </p>
      <div class="flex-center gap-5 mt-5">
        <div class="color-control">
          <div
            class="bg-neutral-300"
            @click="handleColorChange('#adb5bd')"
            :class="{ active: color === '#adb5bd' }"
          />
          <div
            class="bg-neutral-900"
            @click="handleColorChange('#2e2c2e')"
            :class="{ active: color === '#2e2c2e' }"
          />
        </div>
        <div class="size-control">
          <div
            @click="handleSizeChange(0.06)"
            :class="
              scale === 0.06
                ? 'bg-white text-black'
                : 'bg-transparent text-white'
            "
          >
            <p>14"</p>
          </div>
          <div
            @click="handleSizeChange(0.08)"
            :class="
              scale === 0.08
                ? 'bg-white text-black'
                : 'bg-transparent text-white'
            "
          >
            <p>16"</p>
          </div>
        </div>
      </div>
    </div>

    <div ref="canvasRef" id="canvas"></div>
  </section>
</template>

<style scoped></style>
