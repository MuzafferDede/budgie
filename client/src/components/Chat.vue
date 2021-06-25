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
          v-for="user in filteredUsers"
          :key="user.name"
        >
          <span class="inline-block bg-green-400 rounded-full h-2 w-2"></span>
          <span>{{ user.name }}</span>
          <span
            class="italic ml-auto text-sm text-gray-400 animate-pulse"
            v-if="typingUsers.includes(user.id)"
            >typing...</span
          >
        </div>
        <div class="text-sm text-gray-400" v-if="filteredUsers.length === 0">
          There are currently no online users available.
        </div>
      </div>
      <div class="col-span-2 flex flex-col justify-between gap-4">
        <div class="h-full flex-1 bg-white rounded p-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="grid gap-1"
            :class="{
              'justify-end text-right': message.socketId === socket.id,
              'justify-start': message.socketId !== socket.id,
            }"
          >
            <span
              class="text-sm text-gray-500 italic mt-4"
              v-if="message.socketId !== socket.id"
              >{{ message.sender }}</span
            >
            <p
              class="py-2 px-4 inline-block rounded-lg text-sm mt-1"
              :class="{
                'bg-blue-500 text-white': message.socketId === socket.id,
                'bg-gray-200 text-gray-900': message.socketId !== socket.id,
              }"
            >
              {{ message.body }}
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <input
            type="text"
            class="w-full p-4 rounded"
            placeholder="Your message"
            v-model="message"
            @keyup.enter.prevent="sendMessage"
          />
          <button
            class="bg-green-400 text-white p-4 rounded"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentUser: {
      type: String,
      default: undefined,
    },
    socket: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      messages: [],
      users: [],
      message: undefined,
      typingUsers: [],
      timer: undefined,
    };
  },
  computed: {
    filteredUsers() {
      return Object.values(this.users).filter(
        (user) => user.id !== this.socket.id
      );
    },
  },
  mounted() {
    this.socket.on("received-message", (sender) => {
      this.messages.push(sender);
    });

    this.socket.on("users-updated", (users) => {
      this.users = users;
    });

    let timer;

    this.socket.on("user-typing", (user) => {
      this.typingUsers.push(user);
    });

    this.socket.on("user-not-typing", (user) => {
      this.typingUsers = this.typingUsers.filter((item) => item !== user);
    });
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.socket.emit("send-message", {
          sender: this.currentUser,
          socketId: this.socket.id,
          body: this.message,
        });
        this.message = undefined;
      }
    },
  },
  watch: {
    message(value) {
      this.socket.emit(
        Boolean(value) ? "typing" : "not-typing",
        this.currentUser
      );
    },
  },
};
</script>
