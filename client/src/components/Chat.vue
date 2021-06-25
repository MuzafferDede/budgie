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
          <button class="bg-green-400 hover:bg-green-500 text-white rounded p-2 text-xs">Start a new converstaion</button>
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
        <div class="text-sm text-gray-400 space-y-2" v-if="Object.keys(rooms).length === 0">
          <p>
            There are currently no rooms available.
          </p>
          <button class="bg-green-400 hover:bg-green-500 text-white rounded p-2 text-xs">Add Room</button>
        </div>
      </div>
      <div class="col-span-2 flex flex-col justify-between gap-4">
        <div class="h-full flex-1 bg-white rounded p-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="grid gap-1 group"
            :class="{
              'justify-end text-right': message.socketId === user.socket.id,
              'justify-start': message.socketId !== user.socket.id,
            }"
          >
            <span
              class="text-sm text-gray-500 italic mt-4"
              
              ><span v-if="message.socketId !== user.socket.id">{{ message.sender.name }}</span> <span class="text-xs opacity-0 group-hover:opacity-100 not-italic text-blue-400"> {{ (new Date).toLocaleDateString() }}</span></span
            >
            <p
              class="py-2 px-4 inline-block rounded-lg text-sm mt-1"
              :class="{
                'bg-blue-500 text-white': message.socketId === user.socket.id,
                'bg-gray-200 text-gray-900': message.socketId !== user.socket.id,
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
            class="bg-green-400 hover:bg-green-500 text-white p-4 rounded"
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
      timer: undefined,
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
        return this.typingUsers.includes(user.id)
      }
    }
  },
  mounted() {
    this.user.socket.on("received message", (sender) => {
      this.messages.push(sender);
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
      }
    },
  },
  watch: {
    message(value) {
      this.user.socket.emit(
        Boolean(value) ? "typing" : "not typing"
      );
    },
  },
};
</script>
