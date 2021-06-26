<template>
  <button class="px-4 py-2 rounded" :class="bg"><slot /></button>
</template>

<script>
const colors = {
  green: "bg-green-400 hover:bg-green-500 text-white",
  blue: "bg-blue-400 hover:bg-blue-500 text-white",
};
export default {
  props: {
    color: {
      type: String,
      default: 'green',
    },
  },
  computed: {
    bg() {
      return colors[this.color];
    },
  },
};
</script>
