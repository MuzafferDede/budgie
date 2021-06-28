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
import UiButton from "./ui/UiButton.vue";
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
      message: undefined,
    };
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.$store.dispatch("messages/save", {
          user: this.user,
          body: this.message,
          time: new Date(),
        });
        
        this.socket.emit("new message", this.message, this.user.contact);

        this.message = undefined;

        this.$refs.message.focus();
      }
    },
  },
  computed: {
    user() {
      return this.$store.getters['client/user'];
    },
  },
  watch: {
    message(value, oldValue) {
      if (Boolean(value) !== Boolean(oldValue)) {
        this.socket.emit(
          Boolean(value) ? "typing" : "stop typing",
          this.user.contact
        );
      }
    },
  },
};
</script>
