<template>
  <div
    class="lg:max-w-sm w-full flex-col flex-shrink-0 divide-y lg:flex"
    :class="{ hidden: !panel && currentContact }"
  >
    <div class="p-3.5 bg-white flex items-center justify-between">
      <h2 class="text-2xl text-gray-900">Contacts</h2>
      <div class="w-auto flex-0">
        <ui-button
          :disabled="panel === 'ContactList'"
          :class="{ 'opacity-0': panel === 'ContactList' }"
          size="sm"
          @click="$store.dispatch('app/setPanel', 'ContactList')"
        >
          <ui-icon name="add" color="green" />
        </ui-button>
      </div>
    </div>
    <div class="p-3 flex-none">
      <input
        type="text"
        v-model="findContact"
        placeholder="Search in contacts"
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
          class="block"
          v-for="contact in contacts"
          :key="contact.id"
          @click.prevent="setCurrentContact(contact)"
          :class="{
            'hover:bg-gray-100 bg-gray-50 ':
              !currentContact || contact.id !== currentContact.id,
            'bg-blue-100 hover:bg-blue-100':
              currentContact && contact.id === currentContact.id,
          }"
        >
          <div class="flex space-x-2 py-4 px-3 items-center">
            <div class="relative py-1">
              <div
                class="
                  w-10
                  h-10
                  flex
                  rounded-full
                  items-center
                  justify-center
                  shadow
                  relative
                "
                :class="{
                  'animate-bounce':
                    onCall.with &&
                    onCall.with.id === contact.id &&
                    panel !== 'Call',
                }"
              >
                <div
                  class="
                    absolute
                    inset-0
                    rounded-full
                    bg-gradient-to-t
                    from-green-50
                    via-green-300
                    to-green-200
                    ring-2 ring-gray-200
                    z-0
                  "
                  :class="{ 'animate-spin': isTyping(contact) }"
                ></div>
                <ui-icon name="avatar" class="text-gray-900 z-10" />
              </div>
            </div>
            <div class="flex flex-col w-full relative col-span-5">
              <div class="flex justify-between items-center">
                <span class="truncate space-x-2 items-center text-gray-900"
                  ><span>{{ contact.name }}</span>
                </span>

                <span
                  class="flex-shrink-0 text-xs"
                  v-if="lastMessage(contact)"
                  >{{ $time(lastMessage(contact).time) }}</span
                >
              </div>
              <div
                class="w-full flex space-x-2 items-center"
                v-if="lastMessage(contact) && lastMessage(contact).time"
              >
                <p class="truncate text-sm w-full">
                  {{ lastMessage(contact).body }}
                </p>
                <div class="flex-shrink-0 w-5 h-5">
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
import { $time, $socket, $play } from "../utils";
import UiTransition from "./ui/UiTransition.vue";
import UiIcon from "./ui/UiIcon.vue";
import UiButton from "./ui/UiButton.vue";

export default {
  components: { UiTransition, UiIcon, UiButton },
  data() {
    return {
      findContact: "",
      typingUsers: [],
    };
  },
  beforeUnmount() {
    $socket.removeAllListeners("typing");
    $socket.removeAllListeners("stop typing");
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
    user() {
      return this.$store.getters["client/user"];
    },
    contacts() {
      return this.$store.getters["contacts/confirmed"].filter(
        (contact) =>
          contact.name.toLowerCase().indexOf(this.findContact.toLowerCase()) !==
          -1
      );
    },
    currentContact() {
      return this.$store.getters["contacts/contact"];
    },
    requests() {
      return this.$store.getters["requests/sent"];
    },
    newMessages() {
      return (contact) => this.$store.getters["messages/new"](contact);
    },
    lastMessage() {
      return (contact) =>
        this.$store.getters["messages/last"](this.user.id, contact.id);
    },
    onCall() {
      return this.$store.getters["app/onCall"];
    },
    panel() {
      return this.$store.getters["app/panel"];
    },
  },
  methods: {
    $time,
    setCurrentContact(contact) {
      this.$store.dispatch(
        "contacts/setCurrentContact",
        this.currentContact === contact ? undefined : contact
      );
      this.findContact = "";
    },
  },
};
</script>
