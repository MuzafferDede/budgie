<template>
  <div class="w-96 flex flex-col flex-shrink-0 divide-y">
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
                <strong class="font-bold truncate">{{ contact.name }}</strong>
                <span class="flex-shrink-0 text-xs text-blue-400 font-bold">{{
                  lastMessage(contact).time
                }}</span>
              </div>
              <div class="w-full flex space-x-2 items-center">
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
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import UiTransition from "./ui/UiTransition.vue";
import UiIcon from "./ui/UiIcon.vue";
import $socket from "../socket";

const sounds = {
  notify: new Audio("notify.mp3"),
  error: new Audio("error.mp3"),
  typing: new Audio("typing.mp3"),
};

export default {
  components: { UiTransition, UiIcon },
  data() {
    return {
      error: undefined,
      searchConversation: undefined,
      typingUsers: [],
    };
  },
  props: {
    typers: {
      type: Array,
      default: () => [],
    },
    socket: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    isTyping() {
      return (id) => {
        return this.typers.includes(id);
      };
    },
    messages() {
      return this.$store.getters["messages/messages"].all;
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
    requests() {
      return this.$store.getters["requests/requests"].all;
    },
    lastMessage() {
      return (contact) =>
        this.messages
          .reverse()
          .find((message) => message.sender.id === contact.id);
    },
    newMessages() {
      return (contact) => {
        this.messages
          .filter((message) => message.sender.id === contact.id)
          .reduce((current, message) => {
            if (message.new) current++;
            return current;
          }, 0);
      };
    },
  },
  mounted() {
    $socket.on("contact request", (contact) => {
      this.$store.dispatch("requests/addRequest", contact);
    });

    $socket.on("request accepted", (contact) => {
      this.$store.dispatch("contacts/addContact", contact);
    });

    $socket.on("new message", (data) => {
      if (!this.contact || this.contact.id !== data.sender) {
        data = { ...data, new: true };

        this.play("notify");
      }

      this.$store.dispatch("messages/addMessage", data);
    });

    $socket.on("typing", (data) => {
      if (this.contact && this.contact.id === data.user.id) {
        this.play("typing");
      }
      this.typingUsers.push(data.user.id);
    });

    $socket.on("stop typing", (data) => {
      this.typingUsers = this.typingUsers.filter((id) => id !== data.user.id);
    });

    $socket.on("contact left", (contact) => {
      //this.$store.dispatch('contacts/setContactStatus', contact)
    });
  },
  methods: {
    addContact() {
      this.error = undefined;
      if (
        !this.contactId ||
        this.contactId === this.$store.getters["client/user"].id
      ) {
        this.error = "We could not add this user";
        return;
      }

      $socket.emit("add contact", this.contactId);

      this.sent = true;
      this.contactId = undefined;

      //setTimeout(() => {
      this.showAddContact = false;
      this.sent = false;
      //}, 500)
    },
    removeContact(contact) {
      this.$store.dispatch("contacts/removeContact", contact);

      this.$store.dispatch("contacts/setCurrentContact", undefined);
    },
    accept(request) {
      $socket.emit("accept request", request.id);

      this.$store.dispatch("contacts/addContact", request);
    },
    reject(request) {
      this.$store.dispatch("requests/removeRequest", request);
    },
    cancel() {
      this.showAddContact = false;
      this.contactId = undefined;
      this.error = undefined;
    },
    play(type = "online") {
      sounds[type].currentTime = 0;
      sounds[type].play();
    },
  },
};
</script>
