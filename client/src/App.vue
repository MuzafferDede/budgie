<template>
  <div class="bg-indigo-400 min-h-screen lg:h-screen flex">
    <ui-transition animation="translate">
    <Login v-if="!connected" @login="login($event)" />
    <Messenger v-else :socket="socket" @logout="logout" />
    </ui-transition>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import "./assets/style.css";

import Login from "./components/Login.vue";
import Messenger from "./components/Messenger.vue";
import UiTransition from './components/ui/UiTransition.vue';

export default {
  components: {
    Login,
    Messenger,
    UiTransition,
  },
  data() {
    return {
      connected: false,
    };
  },
  computed: {
    socket() {
      return io("http://localhost:8080", {
        autoConnect: false,
      });
    },
  },
  methods: {
    login(user) {
      this.connected = this.socket.connect();

      if (this.connected) {
        this.socket.emit("register", user);

        this.$store.dispatch("client/addClient", user);
      }
    },
    logout() {
      this.socket.disconnect();

      this.$store.dispatch("client/removeClient").then(() => {
        localStorage.removeItem("vuex");
        this.connected = false;
      });
    },
  },
};
</script>

