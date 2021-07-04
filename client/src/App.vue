<template>
  <div
    class="
      min-h-screen
      lg:h-screen
      relative
      antialiased
      bg-gradient-to-t
      to-blue-500
      via-purple-400
      from-pink-700
    "
  >
    <alert />

    <ui-transition animation="translate">
      <login v-if="!user.name" @login="login($event)" />
      <messenger v-else />
    </ui-transition>
  </div>
</template>

<script>
import "./assets/style.css";
import { $socket } from "./utils";

import Login from "./components/Login.vue";
import Messenger from "./components/Messenger.vue";
import UiTransition from "./components/ui/UiTransition.vue";
import Alert from "./components/Alert.vue";

export default {
  components: {
    Login,
    Messenger,
    UiTransition,
    Alert,
  },
  computed: {
    user() {
      return this.$store.getters["client/user"];
    },
    event() {
      return this.$store.getters["app/event"];
    },
  },
  data() {
    return {
      connected: false,
    };
  },
  mounted() {
    if (this.user.name) {
      this.login(this.user);
    }

    $socket.on("disconnect", () => {
      this.$log("you have been disconnected");
    });
  },
  beforeUnmount() {
    $socket.removeAllListeners("disconnect");
  },
  watch: {
    event(event) {
      if (this[event.name]) {
        this[event.name]();
      }
    },
  },
  methods: {
    login(user) {
      this.connected = $socket.connect();

      if (this.connected) {
        $socket.emit("register", user);

        this.$store.dispatch("client/addClient", user);
      }
    },
    logout() {
      $socket.disconnect();

      this.$store.dispatch("client/removeClient").then(() => {
        localStorage.removeItem("vuex");

        this.connected = false;

        window.location.reload();
      });
    },
  },
};
</script>

