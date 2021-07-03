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
    <ui-transition animation="translate">
      <login v-if="!user.name" @login="login($event)" />
      <messenger v-else @logout="logout" />
    </ui-transition>
  </div>
</template>

<script>
import "./assets/style.css";
import { $socket } from "./utils";

import Login from "./components/Login.vue";
import Messenger from "./components/Messenger.vue";
import UiTransition from "./components/ui/UiTransition.vue";

export default {
  components: {
    Login,
    Messenger,
    UiTransition,
  },
  computed: {
    user() {
      return this.$store.getters["client/user"];
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
      });
    },
  },
};
</script>

