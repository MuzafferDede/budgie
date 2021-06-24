<template>
  <Login v-if="!loginUser" @login="join($event)" />
  <Chat v-else :user="loginUser" :socket="serverSocket" />
</template>

<script setup>
import { io } from "socket.io-client";

import "./assets/style.css";

import { ref, reactive } from "vue";

import Login from "./components/Login.vue";
import Chat from "./components/Chat.vue";

const loginUser = ref(undefined);
let serverSocket = ref(undefined);

const join = (user) => {
  const socket = io("http://localhost:3001");

  socket.on("connect", () => {
    socket.emit("login", user);
    serverSocket.value = socket;
    loginUser.value = user;
  });
};
</script>

