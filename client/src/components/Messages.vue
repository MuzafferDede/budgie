<template>
  <div class="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="p-3 flex relative group"
      :class="{
        'space-x-3 space-x-reverse flex-row-reverse':
          message.sender.id === user.id,
        'space-x-3': message.sender.id !== user.id,
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
          >{{ message.sender.name }}</span
        >
        <p
          :class="{ 'left-0': !self(message), 'right-0': self(message) }"
          class="
            text-xs
            translate-y-3
            bg-gray-900 bg-opacity-80
            text-white
            rounded-full
            px-4
            py-2
            absolute
            bottom-full
            transition-all
            duration-150
            opacity-0
            group-hover:opacity-100
            delay-150
          "
        >
          {{ moment(message.time).format("LT") }}
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
export default {
  computed: {
    self() {
      return (message) => message.sender.id === this.user.id;
    },
    user() {
      return this.$store.getters["client/user"];
    },
    messages() {
      return this.$store.getters["messages/messages"].all;
    },
  },
};
</script>
