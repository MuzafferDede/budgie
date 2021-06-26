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
          v-for="item in filteredUsers"
          :key="item.user.id"
        >
          <span class="inline-block bg-green-400 rounded-full h-2 w-2"></span>
          <span>{{ item.user.name }}</span>
          <span
            class="italic ml-auto text-sm text-gray-400 animate-pulse"
            v-if="checkTypers(item.user.id)"
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
              'items-end text-right': message.user.id === user.id,
              'items-start': message.user.id !== user.id,
            }"
          >
            <span class="text-sm text-gray-500 italic mt-4 space-x-2"
              ><span v-if="message.user.id !== user.id">{{
                message.user.name
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
                'bg-blue-500 text-white': message.user.id === user.id,
                'bg-gray-200 text-gray-900': message.user.id !== user.id,
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

const sounds = {
  online: new Audio("online.mp3"),
  typing: new Audio("typing.mp3"),
};

export default {
  components: { UiButton },
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
    checkTypers() {
      return (id) => {
        return this.typingUsers.includes(id);
      };
    },
    typing() {
      return Boolean(this.message);
    },
    time() {
      return (date) => moment(date).format("LT");
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
