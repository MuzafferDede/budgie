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
export default {};
</script>
