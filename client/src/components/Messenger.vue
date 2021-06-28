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
        h-[47vh]
        lg:h-auto
      "
    >
      <Contacts
        :typers="typingUsers"
        :messages="messages"
        :socket="socket"
        @set-contact="contact = $event"
      />
      <div
        class="
          w-full
          mt-auto
          bg-gray-100
          py-2
          px-4
          flex
          space-x-2
          justify-between
          items-center
        "
      >
        <ui-button color="blue" @click="logout">Logout</ui-button>
        <div class="space-y-1 text-xs">
          <strong>Your id</strong>
          <p class="text-gray-500">
            {{ user.id }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="w-full flex flex-col justify-between gap-4 h-[47vh] lg:h-auto"
      v-if="contact"
    >
      <Conversation
        :messages="messages"
        :user="user"
        @close="contact = undefined"
      />
      <Texter
        :contact="contact"
        :socket="socket"
        @message="messages.push({ ...$event, user })"
      />
    </div>
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
import Contacts from "./Contacts.vue";
import Conversation from "./Conversation.vue";
import Texter from "./Texter.vue";

const sounds = {
  notify: new Audio("notify.mp3"),
  error: new Audio("error.mp3"),
  typing: new Audio("typing.mp3"),
};

export default {
  components: { UiButton, Contacts, Conversation, Texter },
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
      contact: undefined,
      message: undefined,
      messages: [],
      typingUsers: [],
    };
  },
  mounted() {
    this.socket.on("new message", (data) => {
      if(!this.$store.getters['client/user'].vision) {
          this.play("notify");
      }
      data = {...data, seen: false}
      this.messages.push(data);
    });

    this.socket.on("contact left", (contact) => {
      //this.$store.dispatch('contacts/setStatus', contact)
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
  },
  methods: {
    logout() {
      localStorage.removeItem("chat-user");

      this.$emit("logout");
    },
    play(type = "online") {
      sounds[type].play();
    },
  },
};
</script>
