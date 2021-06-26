<template>
  <div class="space-y-4 p-4 w-full flex flex-col overflow-hidden">
    <h2 class="font-bold">Contacts</h2>
    <div class="w-full space-y-4 overflow-auto">
      <div
        class="
          bg-gray-100
          rounded
          p-3
          w-full
          text-gray-700
          font-semibold
          flex
          justify-start
          gap-1
          items-center
        "
        v-for="conversation in conversations"
        :key="conversation.user.id"
      >
        <span class="inline-block bg-green-400 rounded-full h-2 w-2"></span>
        <span>{{ conversation.user.name }}</span>
        <span
          class="italic ml-auto text-sm text-gray-400 animate-pulse"
          v-if="isTyping(conversation.user.id)"
          >typing...</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conversations: {
      type: Array,
      default: () => [],
    },
    typers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isTyping() {
      return (id) => {
        return this.typers.includes(id);
      };
    },
  },
};
</script>
