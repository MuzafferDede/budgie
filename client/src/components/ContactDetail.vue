<template>
  <div class="w-96 p-4 flex-shrink-0 space-y-8">
    <div class="grid gap-4 items-center justify-center">
      <div class="bg-gray-400 ring-4 ring-gray-200 p-4 rounded-full text-white">
        <ui-icon name="user" size="4xl" />
      </div>
      <span class="flex flex-col items-center">
        <span class="font-bold text-lg">{{ contact.name }}</span>
        <span class="font-bold text-xs flex items-center space-x-1">
          <span class="bg-green-400 rounded-full p-1.5"></span>
          <span>Available</span>
        </span>
      </span>
    </div>
    <div class="space-y-4 p-4 bg-blue-100 rounded shadow-inner">
      <div>
        <strong class="text-xs text-gray-400">ID</strong>
        <p>{{ contact.id }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    contact() {
      return this.$store.getters["contacts/contact"];
    },
  },
};
</script>

