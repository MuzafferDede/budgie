<template>
  <div class="h-screen overflow-hidden bg-white flex w-full">
    <div
      class="
        bg-gray-800
        text-white
        p-4
        flex-shrink-0 flex flex-col
        space-y-8
        items-center
      "
    >
      <button @click="view = 'messenger'">
        <ui-icon name="logo" size="xl" />
      </button>
      <button
        class="bg-gray-600 hover:bg-gray-700 p-2 rounded-full"
        @click="view = 'contacts'"
      >
        <ui-icon name="contacts" />
      </button>
    </div>
    <div class="w-full flex flex-col overflow-hidden">
      <div class="border-b flex items-center justify-between flex-none">
        <h1 class="font-bold text-2xl p-4">Budgie</h1>
        <div class="w-80 flex space-x-4 relative p-4">
          <div>
            <button
              class="
                p-2
                hover:bg-gray-200
                bg-gray-100
                rounded-full
                relative
                shadow-md
              "
            >
              <span
                class="
                  bg-red-500
                  w-5
                  h-5
                  text-xs
                  absolute
                  top-0
                  right-0
                  -mt-1
                  -mr-1
                  rounded-full
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  shadow-md
                "
                >1</span
              >
              <ui-icon name="notification" />
            </button>
          </div>
          <div class="pl-4 border-l w-full">
            <button
              class="flex w-full space-x-2 items-center text-left group"
              @click="showProfile = !showProfile"
            >
              <span
                class="
                  w-10
                  h-10
                  group-hover:bg-gray-500 group-hover:text-white
                  rounded-full
                  flex
                  justify-center
                  items-center
                  shadow-md
                  flex-shrink-0
                "
                :class="{ 'bg-gray-500 text-white': showProfile }"
              >
                <ui-icon name="user" />
              </span>
              <span class="flex flex-col w-full">
                <span class="font-bold text-lg">{{ user.name }}</span>
                <span class="font-bold text-xs flex items-center space-x-1">
                  <span class="bg-green-400 rounded-full p-1.5"></span>
                  <span>Available</span>
                </span>
              </span>
              <ui-icon
                name="arrow-down"
                class="ml-auto transform transition-all"
                :class="{ 'rotate-180': showProfile }"
              />
            </button>
            <div
              v-if="showProfile"
              class="
                absolute
                bg-white
                shadow-lg
                border
                w-full
                inset-x-0
                top-full
              "
            >
              <button class="w-full p-4 hover:bg-gray-100" @click="logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-1 divide-x overflow-auto">
        <keep-alive>
          <contacts v-if="view === 'messenger'" />
        </keep-alive>
        <keep-alive>
          <conversation v-if="view === 'messenger'" />
        </keep-alive>
        <div
          v-if="view === 'contacts'"
          class="flex flex-1 items-center justify-center"
        >
          <div class="max-w-lg w-full space-y-4">
            <ui-transition animation="pull">
              <p v-if="error" class="text-red-500">{{ error }}</p>
            </ui-transition>
            <input
              type="text "
              placeholder="Contact ID"
              v-model="contactId"
              class="
                w-full
                text-sm text-center
                py-3
                px-4
                rounded-full
                focus:outline-none
                ring-1 ring-gray-200
                focus:ring-blue-300 focus:ring-2
              "
            />
            <div class="flex flex-col space-y-4">
              <button
                class="
                  p-3
                  w-full
                  shadow
                  rounded-full
                  bg-green-400
                  hover:bg-green-500
                  text-white
                  font-bold
                "
                @click="request"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $socket from "../socket";
import Texter from "./Texter.vue";
import UiIcon from "./ui/UiIcon.vue";
import Contacts from "./Contacts.vue";
import UiButton from "./ui/UiButton.vue";
import Conversation from "./Conversation.vue";
import UiTransition from "./ui/UiTransition.vue";

export default {
  components: {
    UiButton,
    Contacts,
    Conversation,
    Texter,
    UiTransition,
    UiIcon,
  },
  data() {
    return {
      showProfile: false,
      view: "messenger",
      contactId: undefined,
      error: undefined,
    };
  },
  props: {
    socket: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    user() {
      return this.$store.getters["client/user"];
    },
  },
  methods: {
    logout() {
      this.$emit("logout");
    },
    request() {
      this.error = undefined;
      if (!this.contactId || this.contactId === this.user.id) {
        this.error = "There was an issue, please try again.";
        return;
      }

      $socket.emit("add contact", this.contactId);

      this.$store.dispatch("requests/addRequest", this.contactId);
      this.contactId = undefined;
    },
  },
};
</script>
