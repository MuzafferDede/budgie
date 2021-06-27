<template>
  <div class="flex gap-4">
    <input
      type="text"
      ref="message"
      class="w-full p-4 rounded"
      placeholder="Your message"
      v-model="message"
      @keyup.enter.prevent="sendMessage"
    />
    <ui-button
      @click="sendMessage"
      :disabled="!message"
      :class="{ 'opacity-75 pointer-events-none': !message }"
      >Send</ui-button
    >
  </div>
</template>

<script>
import UiButton from './ui/UiButton.vue';
export default {
  components: { UiButton },
  props: {
    socket: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      message: undefined
    }
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.socket.emit("new message", this.message);

        this.$emit('message', {
          body: this.message,
          time: new Date(),
        })

        this.message = undefined;

        this.$refs.message.focus();
      }
    },
  },
  watch: {
    message(value, oldValue) {
      if(Boolean(value) !== Boolean(oldValue)) {
        this.socket.emit(Boolean(value) ? "typing" : "stop typing");
      }
    }
  }
};
</script>
