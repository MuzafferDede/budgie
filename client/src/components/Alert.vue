<template>
  <ui-transition animation="pull">
    <div
      class="fixed bottom-0 right-0 m-8 z-50 w-full max-w-xs space-y-4"
      v-show="Object.keys(queue).length"
    >
      <notification
        :info="notification"
        :class="bg"
        v-for="notification of queue"
        :key="notification"
      />
    </div>
  </ui-transition>
</template>

<script>
import Notification from "./Notification.vue";
import UiButton from "./ui/UiButton.vue";
import UiTransition from "./ui/UiTransition.vue";

import { $uuid } from "../utils";

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
      queue: {},
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
    info(info) {
      const id = $uuid();

      this.queue[id] = info;

      setTimeout(() => {
        delete this.queue[id];
      }, 5000);
    },
  },
};
</script>
