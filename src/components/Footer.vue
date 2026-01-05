<script setup>
import { footerLinks } from "../constants";
</script>

<template>
  <footer>
    <div class="info">
      <p>
        More ways to shop:
        <span class="text-link">Find an Apple Store</span>
        or
        <span class="text-link"> other retailer </span>
        near you. Or call 000800 040 1966
      </p>
      <img src="/logo.svg" alt="Apple logo" />
    </div>

    <hr />
    <div class="links">
      <p>Copyright © 2024 Apple Inc. All rights reserved.</p>

      <ul>
        <li v-for="{ label, link } in footerLinks" :key="label">
          <a :href="link">{{ label }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped></style>
