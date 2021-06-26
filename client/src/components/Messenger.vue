<template>
  <div class="container p-4 flex flex-col lg:flex-row gap-4">
    <div
      class="
        lg:w-96
        flex-shrink-0
        bg-white
        rounded
        gap-2
        flex flex-col
        items-start
        h-[47vh] lg:h-auto
      "
    >
      <Contacts :conversations="filteredUsers" :typers="typingUsers" />
      <div class="w-full mt-auto bg-gray-100 py-2 px-4">
        <ui-button color="blue" @click="logout">Logout</ui-button>
      </div>
    </div>
    <div class="w-full flex flex-col justify-between gap-4 h-[47vh] lg:h-auto">
      <conversation :messages="messages" :user="user" />
      <div class="flex gap-4">
        <input
          type="text"
          ref="message"
          class="w-full p-4 rounded"
          placeholder="Your message"
          v-model="message"
          @keyup.enter.prevent="sendMessage"
        />
        <ui-button
          @click="sendMessage"
          :disabled="!message"
          :class="{ 'opacity-75 pointer-events-none': !message }"
          >Send</ui-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
import Contacts from "./Contacts.vue";
import Conversation from "./Conversation.vue";

const sounds = {
  online: new Audio("online.mp3"),
  typing: new Audio("typing.mp3"),
};

export default {
  components: { UiButton, Contacts, Conversation },
  props: {
    user: {
      type: Object,
      default: undefined,
    },
    socket: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      messages: [],
      users: {},
      rooms: {},
      message: undefined,
      typingUsers: [],
    };
  },
  computed: {
    filteredUsers() {
      return Object.values(this.users).filter(
        (data) => data.user.id !== this.user.id
      );
    },

    typing() {
      return Boolean(this.message);
    },
  },
  mounted() {
    this.socket.on("new message", (data) => {
      this.play("typing");

      this.messages.push(data);
    });

    this.socket.on("user joined", (data) => {
      this.play("online");
      this.users[data.user.id] = data;
    });

    this.socket.on("user left", (data) => {
      this.play("typing");

      delete this.users[data.user.id];
    });

    this.socket.on("typing", (data) => {
      this.play("typing");

      this.typingUsers.push(data.user.id);
    });

    this.socket.on("stop typing", (data) => {
      this.typingUsers = this.typingUsers.filter((id) => id !== data.user.id);
    });

    this.socket.on("disconnect", () => {
      console.log("you have been disconnected");
    });

    this.socket.on("reconnect", () => {
      console.log("you have been reconnected");

      if (user) {
        socket.emit("add user", user);
      }
    });

    this.socket.on("reconnect_error", () => {
      console.log("attempt to reconnect has failed");
    });
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.socket.emit("new message", this.message);

        this.messages.push({
          user: this.user,
          body: this.message,
          time: new Date(),
        });

        this.message = undefined;

        this.$refs.message.focus();
      }
    },
    logout() {
      localStorage.removeItem("chat-user");

      this.$emit("logout");
    },
    play(type = "online") {
      sounds[type].play();
    },
  },
  watch: {
    typing(value) {
      this.socket.emit(Boolean(value) ? "typing" : "stop typing");
    },
  },
};
</script>
