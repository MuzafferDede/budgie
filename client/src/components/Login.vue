<template>
  <div class="flex items-center justify-center bg-blue-400 h-screen">
    <div class="container">
      <div class="grid gap-4 mx-auto lg:w-1/3">
        <div class="w-full space-y-1">
          <label for="name" class="text-sm text-white">Your name</label>
          <input
            type="text"
            v-model="user"
            class="p-4 rounded w-full"
            placeholder="e.g John"
            @keyup.enter.prevent="login"
            @input="error = ''"
          />
          <p v-if="!user && error" class="text-red-600 text-sm">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: undefined,
      error: "",
    };
  },
  methods: {
    login() {
      this.user
        ? this.$emit("login", this.user)
        : (this.error = "Please enter your name");
    },
  },
};
</script>

