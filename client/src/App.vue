<template>
  <div>Testing</div>
</template>

<script setup>
import { io } from "socket.io-client";

const server = io("http://localhost:3001");

server.on("connect", () => {
  server.emit("hello", "world");
  console.log('hello ')
  server.on("hello-back", (msg) => {
    console.log(msg);
  });
});
</script>

