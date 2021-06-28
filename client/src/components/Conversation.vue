<template>
  <div class="flex-1 flex flex-col bg-white rounded p-4 overflow-hidden relative">
    <button @click="$emit('close')" class="absolute right-0 top-0 w-8 h-8 hover:text-blue-500" title="Close">
      <span class="transform rotate-45 block text-2xl">+</span>
    </button>
    <div class="overflow-auto">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex flex-col gap-1 group"
        :class="{
          'items-end text-right': message.user.id === user.id,
          'items-start': message.user.id !== user.id,
        }"
      >
        <span class="text-sm text-gray-500 italic mt-4 space-x-2"
          ><span v-if="message.user.id !== user.id">{{
            message.user.name
          }}</span>
          <span
            class="
              text-xs
              opacity-0
              group-hover:opacity-100
              not-italic
              text-blue-400
            "
          >
            {{ time(message.time) }}</span
          ></span
        >
        <p
          class="py-2 px-4 inline-block rounded-lg text-sm mt-1"
          :class="{
            'bg-blue-500 text-white': message.user.id === user.id,
            'bg-gray-200 text-gray-900': message.user.id !== user.id,
          }"
        >
          {{ message.body }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"

export default {
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    time() {
      return (date) => moment(date).format("LT")
    },
    user() {
      return this.$store.getters['client/user']
    }
  },
};
</script>
