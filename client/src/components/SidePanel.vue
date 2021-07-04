<template>
  <div
    class="
      bg-gray-800
      text-white
      p-4
      flex-shrink-0 flex flex-col
      space-y-4
      items-center
    "
  >
    <button
      @click="$store.dispatch('app/setPanel', undefined)"
      class="p-2 bg-white rounded-full text-gray-900 shadow"
    >
      <ui-icon name="avatar" />
    </button>
    <div class="py-4 space-y-5 flex-col flex">
      <button
        class="bg-gray-600 hover:bg-gray-700 p-3 rounded-full"
        @click="$store.dispatch('app/setPanel', 'AddContact')"
      >
        <ui-icon name="contacts" />
      </button>
    </div>
  </div>
</template>

<script>
import UiIcon from "./ui/UiIcon.vue";
export default {
  components: { UiIcon },
};
</script>