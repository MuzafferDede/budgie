<template>
  <div class="h-screen overflow-hidden bg-white flex w-full">
    <div
      class="
        bg-gray-800
        text-white
        p-4
        flex-shrink-0 flex flex-col
        space-y-4
        items-center
      "
    >
      <button
        @click="view = 'messenger'"
        class="
          p-2
          bg-gradient-to-b
          from-blue-50
          via-blue-300
          to-blue-200
          rounded-full
          text-gray-900
          shadow
        "
      >
        <ui-icon name="avatar" />
      </button>
      <div class="py-4 space-y-5 flex-col flex">
        <button
          class="bg-gray-600 hover:bg-gray-700 p-3 rounded-full"
          @click="view = 'contacts'"
        >
          <ui-icon name="contacts" />
        </button>
      </div>
    </div>
    <div class="w-full flex flex-col overflow-hidden">
      <div class="border-b flex items-center justify-between flex-none">
        <h1 class="text-2xl p-4 text-gray-900">Budgie</h1>
        <div class="w-80 flex space-x-4 relative p-4">
          <div class="group">
            <button
              class="
                p-2
                group-hover:bg-gray-500 group-hover:text-white
                rounded-full
                relative
                shadow-md
                border
              "
              :class="{
                'bg-gray-500 text-white': showPanel === 'notifications',
              }"
              @click="togglePanel('notifications')"
            >
              <span
                v-if="receivedRequests.length"
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
                  shadow-md
                "
                >{{ receivedRequests.length }}</span
              >
              <ui-icon name="notification" />
            </button>
          </div>
          <div class="pl-4 border-l w-full">
            <button
              class="flex w-full space-x-2 items-center text-left group"
              @click="togglePanel('profile')"
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
                  border
                  flex-shrink-0
                  ring-1 ring-gray-200
                "
                :class="{ 'bg-gray-500 text-white': showPanel === 'profile' }"
              >
                <ui-icon name="avatar" />
              </span>
              <span class="flex flex-col w-full">
                <span class="text-lg text-gray-900">{{ user.name }}</span>
                <span class="text-xs flex items-center space-x-1">
                  <span class="bg-green-400 rounded-full p-1.5"></span>
                  <span>Available</span>
                </span>
              </span>
              <ui-icon
                name="arrow"
                class="ml-auto transform transition-all"
                :class="{ 'rotate-90': showPanel }"
              />
            </button>
          </div>
        </div>
      </div>
      <div
        class="flex flex-1 divide-x overflow-auto"
        @click="showPanel = undefined"
      >
        <keep-alive>
          <contacts v-if="view === 'messenger' && contacts.length" />
        </keep-alive>
        <keep-alive>
          <conversation v-if="view === 'messenger'" />
        </keep-alive>
        <div
          v-if="view === 'contacts'"
          class="flex flex-1 divide-x overflow-auto"
        >
          <div class="w-full max-w-sm">
            <div class="w-full space-y-4 p-3">
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
                <ui-button @click="request">Request </ui-button>
              </div>
            </div>
          </div>
          <div class="p-3 w-full divide-y">
            <p
              class="italic h-full flex items-center justify-center"
              v-if="!sentRequests.length"
            >
              There are no any requests.
            </p>
            <div
              class="
                p-4
                flex
                justify-between
                items-center
                group
                hover:bg-gray-50
              "
              v-for="(request, index) in sentRequests"
              :key="index"
            >
              <div>
                <p>{{ request.id }}</p>
                <p class="text-xs">{{ $time(request.time) }}</p>
                <p class="text-xs">{{ request.name }}</p>
              </div>
              <div class="flex space-x-2 items-center">
                <ui-button
                  @click="cancelRequest(request)"
                  size="sm"
                  color="red"
                >
                  Cancel
                </ui-button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!contact && view === 'messenger'"
          class="flex flex-1 items-center justify-center"
        >
          <p>Add your contacts to start a conversation</p>
        </div>
      </div>
    </div>

    <div
      class="right-0 top-full bg-white z-30 w-full max-w-sm shadow p-4"
      v-if="showPanel"
    >
      <ui-transition animation="translate">
        <div v-if="showPanel === 'profile'" class="w-full space-y-3">
          <div class="relative">
            <input
              class="
                w-full
                p-3
                focus:outline-none
                bg-blue-200
                rounded
                shadow-inner
                cursor-pointer
              "
              v-model="user.id"
              readonly
              @click="coppied = $copy($event)"
            />
            <ui-transition animation="pull">
              <span
                v-if="coppied"
                class="
                  bg-green-500
                  text-white text-xs
                  rounded-lg
                  right-0
                  top-0
                  m-2
                  opacity-90
                  transform
                  block
                  absolute
                  p-2
                "
                >Coppied</span
              ></ui-transition
            >
          </div>
          <ui-button @click="logout" color="red"> Logout </ui-button>
        </div>
      </ui-transition>

      <ui-transition animation="translate">
        <notifications v-if="showPanel === 'notifications'" />
      </ui-transition>
    </div>
  </div>
</template>

<script>
import { $copy, $play, $socket, $time } from "../utils";
import Texter from "./Texter.vue";
import UiIcon from "./ui/UiIcon.vue";
import Contacts from "./Contacts.vue";
import UiButton from "./ui/UiButton.vue";
import Conversation from "./Conversation.vue";
import UiTransition from "./ui/UiTransition.vue";
import Notifications from "./Notifications.vue";

export default {
  components: {
    UiButton,
    Contacts,
    Conversation,
    Texter,
    UiTransition,
    UiIcon,
    Notifications,
  },
  data() {
    return {
      showPanel: false,
      view: "messenger",
      contactId: undefined,
      error: undefined,
      coppied: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["client/user"];
    },
    contact() {
      return this.$store.getters["contacts/contact"];
    },
    contacts() {
      return this.$store.getters["contacts/all"];
    },
    receivedRequests() {
      return this.$store.getters["requests/received"];
    },
    sentRequests() {
      return this.$store.getters["requests/sent"];
    },
    notifications() {
      return this.$store.getters["notifications/all"];
    },
  },
  mounted() {
    $socket.on("contact request", (contact) => {
      this.$store.dispatch("requests/addRequest", contact);
    });

    $socket.on("contact not found", (request) => {
      this.$store.dispatch("requests/removeRequest", request);

      this.error = "Contact not found";
    });

    $socket.on("request accepted", (contact) => {
      this.$store.dispatch("contacts/addContact", contact);
    });

    $socket.on("new message", (data) => {
      if (!this.contact || this.contact.id !== data.sender) {
        data = { ...data, new: true };

        $play("notify");
      }

      this.$store.dispatch("messages/addMessage", data);
    });

    $socket.on("contact left", (contact) => {
      //this.$store.dispatch('contacts/setContactStatus', contact)
    });
  },
  methods: {
    $copy,
    $play,
    $time,
    logout() {
      this.$emit("logout");
    },
    request() {
      this.error = undefined;

      if (this.contacts.find((contact) => contact.id === this.contactId)) {
        this.error = "This contact already exists";
        return;
      }
      if (!this.contactId || this.contactId === this.user.id) {
        this.error = "There was an issue, please try again.";
        return;
      }

      $socket.emit("add contact", this.contactId);

      this.$store.dispatch("requests/addRequest", {
        id: this.contactId,
        name: "Pending",
      });

      this.contactId = undefined;
    },
    cancelRequest(request) {
      this.$store.dispatch("requests/removeRequest", request);
    },
    togglePanel(view) {
      this.coppied = false;

      if (this.showPanel === view) {
        this.showPanel = undefined;
        return;
      }

      this.showPanel = true;

      this.$nextTick(() => {
        this.showPanel = view;
      });
    },
  },
};
</script>
