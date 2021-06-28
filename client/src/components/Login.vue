<template>
  <div class="container my-auto">
    <div class="grid gap-4 mx-auto lg:w-1/3">
      <div class="text-white text-center">
        <h1 class="text-9xl flex items-center gap-4 justify-center">
          <span class="text-pink-500">h</span><span class="text-3xl">&</span
          ><span class="text-indigo-600">m</span>
        </h1>
        <p>Messenger</p>
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
        <p v-if="!name && error" class="text-red-600 text-sm">
          {{ error }}
        </p>
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

export default {
  data() {
    return {
      name: undefined,
      error: undefined,
    };
  },
  mounted() {
    if (this.user && this.user.name) {
      this.$emit("login", this.user);
    }
  },
  computed: {
    user() {
      return this.$store.getters['client/user'];
    },
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

