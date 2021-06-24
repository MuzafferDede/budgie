<template>
  <div class="bg-indigo-200 h-screen p-4">
    <div class="container grid grid-cols-3 gap-4 h-full">
      <div class="col-span-1 bg-white p-4 rounded">Hello {{ user.name }}</div>
      <div class="col-span-2 flex flex-col justify-between gap-4">
        <div class="h-full flex-1 bg-white rounded p-4 space-y-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="grid gap-1"
            :class="{ 'justify-end text-right': message.socketId === socket.id, 'justify-start' :  message.socketId !== socket.id}"
          >
            <span class="text-sm text-gray-500 italic">{{ message.name }}</span>
            <p class="py-2 px-4 inline-block rounded-2xl" :class="{'bg-blue-500 text-white' : message.socketId === socket.id, 'bg-gray-200 text-gray-900' : message.socketId !== socket.id}">{{ message.body }}</p>
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
    user: {
      type: Object,
      default: () => undefined,
    },
    socket: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      messages: [],
      message: undefined,
    };
  },
  mounted() {
    this.socket.on("tellme", (message) => {
      console.log(message);
    });

    this.socket.on("received-message", (sender) => {
      this.messages.push(sender);
    });
  },
  methods: {
    sendMessage() {
      this.socket.emit("send-message", {
        ...this.user,
        socketId: this.socket.id,
        body: this.message,
      });
      this.message = undefined;
    },
  },
};
</script>
