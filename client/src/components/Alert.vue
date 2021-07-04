<template>
  <ui-transition animation="pull">
    <div class="fixed bottom-0 right-0 m-4 z-50 w-full max-w-xs" v-if="show">
      <notification :info="info" :class="bg" />
    </div>
  </ui-transition>
</template>

<script>
import Notification from "./Notification.vue";
import UiButton from "./ui/UiButton.vue";
import UiTransition from "./ui/UiTransition.vue";

const colors = {
  green: "bg-green-400 text-white",
  blue: "bg-blue-400 text-white",
  red: "bg-red-400 text-white",
  white: "bg-white",
};

export default {
  components: { Notification, UiTransition, UiButton },
  props: {
    color: {
      type: String,
      default: "white",
    },
  },
  data() {
    return {
      show: undefined,
    };
  },
  computed: {
    info() {
      return this.$store.getters["app/alert"];
    },
    bg() {
      return colors[this.info.color];
    },
  },
  watch: {
    info(newInfo, oldInfo) {
      if (newInfo !== oldInfo) {
        clearTimeout(this.show);

        this.show = setTimeout(() => {
          this.show = undefined;
        }, 5000);
      }
    },
  },
};
</script>
