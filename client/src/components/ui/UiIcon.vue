<template>
  <compoment class="flex-shrink-0" :is="currentIcon" :class="dimension" />
</template>

<script>
import * as icons from "../../icons";

const dimensions = {
  none: "",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  DEFAULT: "w-6 h-6",
  lg: "w-8 h-8 ",
  xl: "w-10 h-10",
  "2xl": "w-12 h-12",
  "3xl": "w-16 h-16",
  "4xl": "w-20 h-20",
};

export default {
  props: {
    name: {
      type: String,
      default: undefined,
    },
    size: {
      type: String,
      default: "DEFAULT",
    },
  },
  computed: {
    // assign width and height of the icon
    dimension() {
      return dimensions[this.size];
    },
    currentIcon() {
      return icons[this.name];
    },
  },
};
</script>
