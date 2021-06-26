<template>
  <div class="bg-indigo-200 h-screen p-4">
    <div class="container grid grid-cols-3 gap-4 h-full">
      <div
        class="col-span-1 bg-white items-start p-4 rounded flex flex-col gap-2"
      >
        <h2 class="font-bold">Chats</h2>
        <div
          class="
            bg-gray-100
            rounded
            p-3
            w-full
            text-gray-700
            font-semibold
            flex
            justify-start
            gap-1
            items-center
          "
          v-for="userItem in filteredUsers"
          :key="userItem.id"
        >
          <span class="inline-block bg-green-400 rounded-full h-2 w-2"></span>
          <span>{{ userItem.name }}</span>
          <span
            class="italic ml-auto text-sm text-gray-400 animate-pulse"
            v-if="checkTypers(userItem)"
            >typing...</span
          >
        </div>
        <div class="text-sm text-gray-400 space-y-2">
          <p v-if="filteredUsers.length === 0">
            There are currently no online users available.
          </p>
          <ui-button>Start a new converstaio</ui-button>
        </div>
        <div class="h-1 bg-gray-100 w-full my-4"></div>
        <h2 class="font-bold">Rooms</h2>
        <div
          class="
            bg-gray-100
            rounded
            p-3
            w-full
            text-gray-700
            font-semibold
            flex
            justify-start
            gap-1
            items-center
          "
          v-for="room in rooms"
          :key="room.name"
        >
          <span class="inline-block bg-green-400 rounded-full h-2 w-2"></span>
          <span>{{ room.name }}</span>
        </div>
        <div
          class="text-sm text-gray-400 space-y-2"
          v-if="Object.keys(rooms).length === 0"
        >
          <p>There are currently no rooms available.</p>
          <ui-button>Add a room</ui-button>
        </div>
        <div class="w-full mt-auto">
          <ui-button color="blue" @click="logout">Logout</ui-button>
        </div>
      </div>
      <div class="col-span-2 flex flex-col justify-between gap-4">
        <div class="h-full flex-1 bg-white rounded p-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex flex-col gap-1 group"
            :class="{
              'items-end text-right': message.socketId === user.socket.id,
              'items-start': message.socketId !== user.socket.id,
            }"
          >
            <span class="text-sm text-gray-500 italic mt-4 space-x-2"
              ><span v-if="message.socketId !== user.socket.id">{{
                message.sender.name
              }}</span>
              <span
                class="
                  text-xs
                  opacity-0
                  group-hover:opacity-100
                  not-italic
                  text-blue-400
                "
              >
                {{ time(message.time) }}</span
              ></span
            >
            <p
              class="py-2 px-4 inline-block rounded-lg text-sm mt-1"
              :class="{
                'bg-blue-500 text-white': message.socketId === user.socket.id,
                'bg-gray-200 text-gray-900':
                  message.socketId !== user.socket.id,
              }"
            >
              {{ message.body }}
            </p>
          </div>
        </div>
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
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
import moment from "moment";

export default {
  components: { UiButton },
  props: {
    user: {
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
        (user) => user.id !== this.user.info.id
      );
    },
    checkTypers() {
      return (user) => {
        return this.typingUsers.includes(user.id);
      };
    },
    typing() {
      return Boolean(this.message);
    },
    time() {
      return (date) => moment(date).format('LT');
    },
  },
  mounted() {
    this.user.socket.on("received message", (message) => {
      this.messages.push(message);
    });

    this.user.socket.on("new user", (users) => {
      this.users = users;
    });

    this.user.socket.on("user typing", (socketId) => {
      this.typingUsers.push(socketId);
    });

    this.user.socket.on("user not typing", (socketId) => {
      this.typingUsers = this.typingUsers.filter((item) => item !== socketId);
    });
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.user.socket.emit("send message", {
          sender: this.user.info,
          socketId: this.user.socket.id,
          body: this.message,
        });
        this.message = undefined;
        this.$refs.message.focus();
      }
    },
    logout() {
      localStorage.removeItem("chat-user");
      this.$emit("logout");
    },
  },
  watch: {
    typing(value) {
      this.user.socket.emit(Boolean(value) ? "typing" : "not typing");
    },
  },
};
</script>
