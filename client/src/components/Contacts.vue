<template>
  <div class="max-w-sm w-full flex flex-col flex-shrink-0 divide-y">
    <div class="p-3 flex-none">
      <input
        type="text"
        v-model="searchConversation"
        placeholder="Search in conversations"
        class="
          w-full
          text-sm
          py-3
          px-4
          rounded-full
          focus:outline-none
          ring-1 ring-gray-200
          focus:ring-blue-300 focus:ring-2
        "
      />
    </div>
    <div class="overflow-hidden flex flex-col flex-1">
      <div class="divide-y overflow-x-hidden overflow-y-auto">
        <a
          href="#"
          class="divide-y hover:bg-gray-100 block"
          v-for="contact in contacts"
          :key="contact.id"
          @click.prevent="setCurrentContact(contact)"
        >
          <div class="grid grid-cols-6 gap-2 py-4 px-3 items-center">
            <div class="relative col-span-1">
              <div
                class="
                  rounded-full
                  h-12
                  w-12
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  bg-gray-200
                "
              >
                <ui-icon name="user" class="text-gray-400" />
                <span
                  class="
                    bg-green-400
                    rounded-full
                    p-1.5
                    absolute
                    bottom-0
                    right-0
                    border-2 border-white
                  "
                ></span>
              </div>
            </div>
            <div class="flex flex-col w-full relative col-span-5">
              <div class="flex justify-between items-center">
                <strong class="font-bold truncate">{{ contact.name }} </strong>
                <span
                  class="flex-shrink-0 text-xs text-blue-400 font-bold"
                  v-if="lastMessage(contact)"
                  >{{ $time(lastMessage(contact).time) }}</span
                >
              </div>
              <div
                class="w-full flex space-x-2 items-center"
                v-if="
                  lastMessage(contact) &&
                  lastMessage(contact).time &&
                  !isTyping(contact)
                "
              >
                <p class="truncate text-sm">
                  {{ lastMessage(contact).body }}
                </p>
                <div class="flex-shrink-0 w-5 h-5 font-bold">
                  <span
                    v-if="newMessages(contact)"
                    class="
                      flex
                      w-5
                      items-center
                      justify-center
                      bg-blue-400
                      h-5
                      text-xs
                      rounded-full
                      text-white
                      shadow-md
                    "
                    >{{ newMessages(contact) }}</span
                  >
                  <span
                    class="flex"
                    v-else
                    :class="{
                      'text-blue-500': lastMessage(contact).sent,
                    }"
                  >
                    <ui-icon name="check" size="sm" />
                    <ui-icon
                      v-if="lastMessage(contact).seen"
                      name="check"
                      size="sm"
                      class="-ml-2.5"
                    />
                  </span>
                </div>
              </div>
              <div v-else class="flex space-x-1 items-center animate-pulse">
                <span v-if="isTyping(contact)" class="text-xs text-gray-500"
                  >typing...</span
                >
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { $time, $socket, $play } from "../utils";
import UiTransition from "./ui/UiTransition.vue";
import UiIcon from "./ui/UiIcon.vue";

export default {
  components: { UiTransition, UiIcon },
  data() {
    return {
      error: undefined,
      searchConversation: undefined,
      typingUsers: [],
    };
  },
  mounted() {
    $socket.on("typing", (data) => {
      if (this.currentContact) {
        $play("typing");
      }
      this.typingUsers.push(data.user.id);
    });

    $socket.on("stop typing", (data) => {
      this.typingUsers = this.typingUsers.filter((id) => id !== data.user.id);
    });
  },
  computed: {
    isTyping() {
      return (contact) => {
        return this.typingUsers.includes(contact.id);
      };
    },
    messages() {
      return this.$store.getters["messages/all"];
    },
    notSeen() {
      return (id) => {
        return this.messages
          .filter((message) => message.new)
          .reduce((current, next) => {
            next.sender === id && current++;

            return current;
          }, 0);
      };
    },
    contacts() {
      return this.$store.getters["contacts/all"];
    },
    currentContact() {
      return this.$store.getters["contacts/contact"];
    },
    requests() {
      return this.$store.getters["requests/all"].filter((request) => {
        request.id !== this.user.id;
      });
    },
    newMessages() {
      return (contact) => {
        this.messages
          .filter((message) => message.sender.id === contact.id)
          .reduce((current, message) => {
            if (message.new) current++;
            return current;
          }, 1);
      };
    },
  },
  methods: {
    $time,
    setCurrentContact(contact) {
      this.$store.dispatch("contacts/setCurrentContact", contact);
    },
    removeContact(contact) {
      this.$store.dispatch("contacts/removeContact", contact);
    },
    lastMessage(contact) {
      return [...this.messages]
        .reverse()
        .find((message) => message.sender.id === contact.id);
    },
  },
};
</script>
