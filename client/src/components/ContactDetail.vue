<template>
  <div class="w-96 p-4 flex-shrink-0 space-y-8">
    <div class="space-y-4">
      <div class="flex justify-center items-center">
        <div
          class="
            p-4
            bg-gradient-to-b
            from-blue-50
            via-blue-300
            to-blue-200
            rounded-full
            text-gray-900
            shadow-lg
            ring-2 ring-gray-200
          "
        >
          <ui-icon name="avatar" size="3xl" />
        </div>
      </div>
      <span class="flex flex-col items-center">
        <span class="text-lg">{{ contact.name }}</span>
        <span class="text-xs flex items-center space-x-1">
          <span class="bg-green-400 rounded-full p-1.5"></span>
          <span>Available</span>
        </span>
      </span>
    </div>
    <div class="space-y-4 p-4 bg-blue-100 rounded shadow-inner">
      <div>
        <strong class="text-xs">ID</strong>
        <p>{{ contact.id }}</p>
      </div>
    </div>
    <button
      @click="removeContact(contact)"
      class="
        p-3
        w-full
        shadow
        rounded-full
        bg-blue-400
        hover:bg-blue-500
        text-white
      "
    >
      Delete
    </button>
  </div>
</template>

<script>
import UiIcon from "./ui/UiIcon.vue";
export default {
  components: { UiIcon },
  computed: {
    contact() {
      return this.$store.getters["contacts/contact"];
    },
  },
  methods: {
    removeContact(contact) {
      this.$store.dispatch("contacts/removeContact", contact);
    },
  },
};
</script>

