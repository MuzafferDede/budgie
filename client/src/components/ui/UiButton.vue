<template>
  <button class="rounded-full w-full" :class="[bg, padding]">
    <slot />
  </button>
</template>

<script>
const colors = {
  none: "",
  green: "bg-green-400 hover:bg-green-500 text-white",
  blue: "bg-blue-400 hover:bg-blue-500 text-white",
  red: "bg-red-400 hover:bg-red-500 text-white",
  gray: "bg-gray-400 hover:bg-gray-500 text-white",
  white: "bg-white hover:bg-gray-100 shadow",
};

const sizes = {
  sm: "px-2 py-2 text-sm",
  base: "px-3 py-3 text-lg",
  lg: "px-5 py-5 text-lg",
  xl: "px-8 py-8 text-2xl",
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
