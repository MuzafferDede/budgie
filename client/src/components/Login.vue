<template>
  <div
    class="container my-auto absolute inset-0 flex justify-center items-center"
  >
    <div class="grid gap-4 mx-auto lg:w-1/3">
      <div class="text-white flex items-center justify-center space-x-4">
        <ui-icon name="logo" size="4xl" />
        <p class="text-3xl">Budgie</p>
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
        <button
          @click="login"
          class="
            w-full
            bg-green-400
            hover:bg-blue-700
            p-3
            text-white
            rounded
            text-2xl
          "
        >
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as userId } from "uuid";
import UiTransition from "./ui/UiTransition.vue";
import UiIcon from "./ui/UiIcon.vue";

export default {
  components: { UiTransition, UiIcon },
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

