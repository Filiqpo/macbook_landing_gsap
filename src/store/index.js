import { defineStore } from "pinia";

export const useMacbookStore = defineStore("macbook", {
  state: () => ({
    color: "#2e2c2e",
    scale: 0.08,
    texture: "/videos/feature-1.mp4",
    modelPath: "/models/macbook-16-transformed.glb",
  }),

  actions: {
    setColor(color) {
      this.color = color;
    },

    setScale(scale) {
      this.scale = scale;
      // Aggiorna il modello in base alla scala
      if (scale === 0.06) {
        this.modelPath = "/models/macbook-14-transformed.glb";
      } else {
        this.modelPath = "/models/macbook-16-transformed.glb";
      }
    },

    setTexture(texture) {
      this.texture = texture;
    },

    setModelPath(path) {
      this.modelPath = path;
    },

    reset() {
      this.color = "#2e2c2e";
      this.scale = 0.08;
      this.texture = "/videos/feature-1.mp4";
      this.modelPath = "/models/macbook-16-transformed.glb";
    },
  },

  getters: {
    isSpaceBlack: (state) => state.color === "#2e2c2e",
    isSilver: (state) => state.color === "#adb5bd",
    is14Inch: (state) => state.scale === 0.06,
    is16Inch: (state) => state.scale === 0.08,
  },
});
