<template>
  <div class="flex-none flex items-center space-x-3 p-3 bg-gray-200">
    <textarea
      v-model="message"
      ref="message"
      class="
        w-full
        resize-none
        p-3
        rounded-3xl
        row-1
        focus:outline-none
        ring-1 ring-gray-200
        focus:ring-blue-300 focus:ring-2
      "
      rows="1"
      placeholder="Type a message"
      @keydown.enter.prevent="sendMessage"
    ></textarea>
    <button
      class="
        p-2
        bg-white
        hover:bg-blue-400
        hover:text-white
        rounded-full
        relative
        shadow-md
      "
      @click="sendMessage"
    >
      <ui-icon name="send" size="lg" />
    </button>
  </div>
</template>

<script>
import { $socket } from "../utils";
import UiIcon from "./ui/UiIcon.vue";

export default {
  components: { UiIcon },
  data() {
    return {
      message: undefined,
    };
  },
  methods: {
    sendMessage() {
      this.message = this.message.trim();
      
      if (!this.message) return;

      this.$store.dispatch("messages/addMessage", {
        sender: this.user.id,
        receiver: this.contact.id,
        body: this.message.trim(),
        time: new Date(),
      });

      $socket.emit("new message", this.contact.id, this.message);

      this.message = undefined;

      this.$refs.message.focus();
    },
  },
  computed: {
    user() {
      return this.$store.getters["client/user"];
    },
    contact() {
      return this.$store.getters["contacts/contact"];
    },
  },
  watch: {
    message(value, oldValue) {
      if (Boolean(value) !== Boolean(oldValue)) {
        $socket.emit(
          Boolean(value) ? "typing" : "stop typing",
          this.contact.id
        );
      }
    },
  },
};
</script>
