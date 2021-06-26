<template>
  <div class="bg-indigo-400 min-h-screen lg:h-screen flex">
    <Login v-if="!user" @login="join($event)" />
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
  data() {
    return {
      user: undefined,
      socket: undefined,
    };
  },
  methods: {
    join(user) {
      this.user = user;
      this.socket = io("http://localhost:3001");

      // Tell the server your username
      this.socket.emit("add user", user);
    },
    logout() {
      this.socket.disconnect();
      this.user = undefined;
    },
  },
};
</script>

