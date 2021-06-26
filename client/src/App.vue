<template>
  <Login v-if="!user" @login="join($event)" />
  <Chat v-else :user="user" :socket="socket" @logout="logout" />
</template>

<script>
import { io } from "socket.io-client";
import "./assets/style.css";

import Login from "./components/Login.vue";
import Chat from "./components/Chat.vue";

export default {
  components: {
    Login,
    Chat,
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

