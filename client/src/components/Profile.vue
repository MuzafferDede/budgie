<template>
  <div class="w-full space-y-3">
    <div class="relative">
      <input
        class="
          w-full
          p-3
          focus:outline-none
          bg-blue-200
          rounded
          shadow-inner
          cursor-pointer
        "
        v-model="user.id"
        readonly
        @click="coppied = $copy($event)"
      />
      <ui-transition animation="pull">
        <span
          v-if="coppied"
          class="
            bg-green-500
            text-white text-xs
            rounded-lg
            right-0
            top-0
            m-2
            opacity-90
            transform
            block
            absolute
            p-2
          "
          >Coppied</span
        ></ui-transition
      >
    </div>
    <ui-button
      @click="
        $store.dispatch('app/setEvent', { name: 'logout', time: new Date() })
      "
      color="red"
    >
      Logout
    </ui-button>
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
import UiTransition from "./ui/UiTransition.vue";
import { $copy } from "../utils";

export default {
  components: { UiTransition, UiButton },
  data() {
    return {
      coppied: undefined,
    };
  },
  computed: {
    user() {
      return this.$store.getters["client/user"];
    },
  },
  methods: {
    $copy,
  },
};
</script>
