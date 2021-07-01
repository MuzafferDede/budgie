<template>
  <div
    class="container my-auto absolute inset-0 flex justify-center items-center"
  >
    <div class="grid gap-8 mx-auto w-full lg:max-w-lg">
      <div class="flex items-center justify-center space-x-4">
        <div
          class="
            p-3
            bg-gradient-to-b
            from-blue-50
            via-blue-300
            to-blue-200
            rounded-full
            text-gray-900
            shadow
          "
        >
          <ui-icon name="avatar" size="xl" />
        </div>
        <p class="text-3xl text-white">Budgie</p>
      </div>
      <div class="w-full flex items-center space-x-4">
        <div class="flex-1 space-y-2">
          <label for="name" class="text-sm text-white">Your name</label>
          <input
            type="text"
            v-model="name"
            class="
              p-3
              rounded-full
              w-full
              focus:outline-none
              focus:ring-2
              ring-purple-600
              text-purple-500 text-center text-xl
            "
            placeholder="e.g Muzaffer"
            @keyup.enter.prevent="login"
            @input="error = ''"
          />
          <ui-transition animation="translate">
            <p v-if="!name && error" class="text-sm p-2 bg-white rounded">
              {{ error }}
            </p>
          </ui-transition>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <ui-button @click="login" size="lg"> Join </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as userId } from "uuid";
import UiTransition from "./ui/UiTransition.vue";
import UiIcon from "./ui/UiIcon.vue";
import UiButton from "./ui/UiButton.vue";

const avatars = ["a", "b", "c", "d", "e", "f"];

const colors = {
  DEFAULT: "bg-transparent",
  white: "bg-white",
  gray: "bg-gray-400",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
  green: "bg-green-400",
  yellow: "bg-yellow-400",
  indigo: "bg-indigo-400",
  pink: "bg-pink-400",
};

export default {
  components: { UiTransition, UiIcon, UiButton },
  data() {
    return {
      name: undefined,
      error: undefined,
      avatar: "a",
    };
  },
  computed: {
    avatars() {
      return avatars;
    },
  },
  methods: {
    login() {
      this.name
        ? this.$emit("login", {
            id: userId(),
            name: this.name,
            avatar: this.avatar,
          })
        : (this.error = "Please enter your name");
    },
  },
};
</script>

