<template>
  <div
    class="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
    ref="scroll"
  >
    <div
      v-for="(message, index) in messages"
      ref="message"
      :key="index"
      class="p-3 flex relative group"
      :class="{
        'space-x-3 space-x-reverse flex-row-reverse':
          message.sender === user.id,
        'space-x-3': message.sender !== user.id,
      }"
    >
      <div
        class="
          rounded-full
          h-12
          w-12
          flex-shrink-0 flex
          items-center
          justify-center
          shadow-sm
          bg-gray-200
        "
      >
        <ui-icon name="user" class="text-gray-400" />
      </div>
      <div class="space-y-1 relative">
        <span
          class="block text-xs text-gray-400"
          :class="{
            'text-right': self(message),
          }"
          >{{ self(message) ? user.name : contact.name }}</span
        >
        <p
          :class="{ 'right-0': self(message), 'left-0': !self(message) }"
          class="
            text-xs
            translate-y-4
            bg-gray-900 bg-opacity-80
            text-white
            text-center
            whitespace-nowrap
            rounded-full
            py-2
            px-4
            absolute
            bottom-full
            transition-all
            duration-150
            opacity-0
            group-hover:opacity-100
            delay-150
          "
        >
          {{ $time(message.time) }}
        </p>
        <p
          :class="{
            'rounded-tl-3xl bg-blue-500 text-white': self(message),
            'rounded-tr-3xl bg-gray-200': !self(message),
          }"
          class="text-sm py-2 px-6 rounded-b-3xl shadow-inner max-w-lg"
        >
          {{ message.body }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { $time } from "../utils";
import UiIcon from "./ui/UiIcon.vue";

export default {
  components: { UiIcon },
  computed: {
    self() {
      return (message) => message.sender === this.user.id;
    },
    user() {
      return this.$store.getters["client/user"];
    },
    contact() {
      return this.$store.getters["contacts/contact"];
    },
    messages() {
      return this.$store.getters["messages/current"](
        this.user.id,
        this.contact && this.contact.id
      );
    },
  },
  mounted() {
    this.scrollToBottom();
  },
  watch: {
    messages(value, oldValue) {
      if (value.length > oldValue.length) {
        this.scrollToBottom();
      }
    },
  },
  methods: {
    $time,
    scrollToBottom() {
      this.$nextTick(() => {
        // scroll to bottom of the messages
        this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
      });
    },
  },
};
</script>
