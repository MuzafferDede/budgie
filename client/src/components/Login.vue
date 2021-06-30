<template>
  <div
    class="container my-auto absolute inset-0 flex justify-center items-center"
  >
    <div class="grid gap-4 mx-auto lg:w-1/3">
      <div class="text-white flex items-center justify-center space-x-4">
        <ui-icon name="logo" size="4xl" />
        <p class="text-5xl font-bold">Budgie</p>
      </div>
      <div class="w-full space-y-1">
        <label for="name" class="text-sm text-white">Your name</label>
        <input
          type="text"
          v-model="name"
          class="p-4 rounded w-full"
          placeholder="e.g Muzaffer"
          @keyup.enter.prevent="login"
          @input="error = ''"
        />
        <ui-transition animation="pull">
          <p v-if="!name && error" class="text-red-600 text-sm">
            {{ error }}
          </p>
        </ui-transition>
      </div>
      <div class="w-full flex justify-center">
        <ui-button @click="login" size="xl"> Join </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as userId } from "uuid";
import UiTransition from "./ui/UiTransition.vue";
import UiIcon from "./ui/UiIcon.vue";
import UiButton from "./ui/UiButton.vue";

export default {
  components: { UiTransition, UiIcon, UiButton },
  data() {
    return {
      name: undefined,
      error: undefined,
    };
  },
  methods: {
    login() {
      this.name
        ? this.$emit("login", { id: userId(), name: this.name })
        : (this.error = "Please enter your name");
    },
  },
};
</script>

