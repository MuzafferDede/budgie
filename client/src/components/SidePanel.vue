<template>
  <div
    class="
      bg-gray-800
      text-white
      p-2
      lg:p-4
      flex-shrink-0 flex
      lg:flex-col
      lg:space-y-4
      items-center
      space-x-4
      lg:space-x-0
      justify-center
      lg:justify-start
    "
  >
    <button
      title="Budgie Messenger"
      @click="$store.dispatch('app/setPanel', undefined)"
      class="p-2 bg-white rounded-full text-gray-900 shadow"
    >
      <ui-icon name="avatar" />
    </button>
  </div>
</template>

<script>
import UiIcon from "./ui/UiIcon.vue";
export default {
  components: { UiIcon },
};
</script>