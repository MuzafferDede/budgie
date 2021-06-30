<template>
  <div class="flex w-full divide-x" v-if="contact">
    <div class="w-full flex-1 flex flex-col bg-gray-50 min-w-min divide-y">
      <div class="p-3.5 bg-white flex items-center justify-between">
        <h2 class="text-2xl font-bold">{{ contact.name }}</h2>
        <button
          class="
            p-2
            hover:bg-gray-100
            rounded-full
            relative
            shadow-md
            transition-all
            duration-150
          "
          :class="{ 'rotate-90': showDetail }"
          @click="showDetail = !showDetail"
        >
          <ui-icon name="options" />
        </button>
      </div>
      <messages />
      <texter />
    </div>
    <ui-transition animation="translate">
      <contact-detail v-if="showDetail" />
    </ui-transition>
  </div>
</template>

<script>
import UiIcon from "./ui/UiIcon.vue";
import Messages from "./Messages.vue";
import Texter from "./Texter.vue";
import ContactDetail from "./ContactDetail.vue";
import UiTransition from "./ui/UiTransition.vue";

export default {
  components: { UiIcon, Messages, Texter, ContactDetail, UiTransition },
  data() {
    return {
      showDetail: false,
    };
  },
  computed: {
    contact() {
      return this.$store.getters["contacts/contact"];
    },
  },
};
</script>
