<script setup>
import { GLTFModel } from "@tresjs/cientos";

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
});
</script>

<template>
  <GLTFModel path="/models/macbook-14-transformed.glb" :scale="scale" />
</template>

<style scoped></style>
