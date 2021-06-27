<template>
  <div class="bg-indigo-400 min-h-screen lg:h-screen flex">
    <Login v-if="!user.name" @login="login($event)" />
    <Messenger v-else :user="user" :socket="socket" @logout="logout" />
  </div>
</template>

<script>
import { io } from "socket.io-client";
import "./assets/style.css";

import Login from "./components/Login.vue";
import Messenger from "./components/Messenger.vue";

export default {
  components: {
    Login,
    Messenger,
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
    socket() {
      return io("http://localhost:5001", {
        autoConnect: false,
      });
    },
  },
  mounted() {
    this.socket.disconnect();

    this.login(this.user);
  },
  methods: {
    login(user) {
      if (this.user && user) {
        this.socket.connect();
        this.socket.emit("add user", user);

        this.$store.dispatch("saveUser", user);
      }
    },
    logout() {
      this.socket.disconnect();
      this.$store.dispatch("deleteUser");
    },
  },
};
</script>

