<template>
  <button class="rounded-full w-full font-bold" :class="[bg, padding]">
    <slot />
  </button>
</template>

<script>
const colors = {
  green: "bg-green-400 hover:bg-green-500 text-white",
  blue: "bg-blue-400 hover:bg-blue-500 text-white",
  red: "bg-red-400 hover:bg-red-500 text-white",
};

const sizes = {
  sm: "px-2 py-1 text-sm",
  base: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

export default {
  props: {
    color: {
      type: String,
      default: "green",
    },
    size: {
      type: String,
      default: "base",
    },
  },
  computed: {
    bg() {
      return colors[this.color];
    },
    padding() {
      return sizes[this.size];
    },
  },
};
</script>
