<template>
  <div class="h-screen overflow-hidden bg-white flex w-full">
    <side-panel />
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
                'bg-gray-500 text-white': panel === 'Notifications',
              }"
              @click="$store.dispatch('app/setPanel', 'Notifications')"
            >
              <span
                v-if="notifications.length"
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
                >{{ notifications.length }}</span
              >
              <ui-icon name="notification" />
            </button>
          </div>
          <div class="pl-4 border-l w-full">
            <button
              class="flex w-full space-x-2 items-center text-left group"
              @click="$store.dispatch('app/setPanel', 'Profile')"
            >
              <span
                class="
                  p-2
                  group-hover:bg-gray-500 group-hover:text-white
                  rounded-full
                  relative
                  shadow-md
                  border
                "
                :class="{ 'bg-gray-500 text-white': panel === 'Profile' }"
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
                :class="{ 'rotate-90': panel === 'Profile' }"
              />
            </button>
          </div>
        </div>
      </div>
      <div
        class="flex flex-1 divide-x overflow-auto"
        @click="$store.dispatch('app/setPanel', undefined)"
      >
        <conversation />
      </div>
    </div>
    <ui-transition animation="slide">
      <div
        class="space-y-4 relative bg-white z-30 w-full max-w-sm shadow p-4"
        v-if="panel"
      >
        <ui-transition animation="pull">
          <component :is="panelComponent"></component>
        </ui-transition>
      </div>
    </ui-transition>
  </div>
</template>

<script>
import { $play, $socket } from "../utils";
import AddContact from "./AddContact.vue";
import UiIcon from "./ui/UiIcon.vue";
import Conversation from "./Conversation.vue";
import UiTransition from "./ui/UiTransition.vue";
import Notifications from "./Notifications.vue";
import Profile from "./Profile.vue";
import SidePanel from "./SidePanel.vue";
import Call from "./Call.vue";

export default {
  components: {
    AddContact,
    Conversation,
    UiTransition,
    UiIcon,
    Notifications,
    Profile,
    SidePanel,
    Call,
  },
  data() {
    return {
      contactId: undefined,
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
      return this.$store.getters["contacts/confirmed"];
    },
    notifications() {
      return this.$store.getters["notifications/unseen"];
    },
    panel() {
      return this.$store.getters["app/panel"];
    },
    panelComponent() {
      return this.$options.components[this.panel];
    },
  },
  mounted() {
    $socket.on("contact request", (payload) => {
      const isContactExists = this.contacts.find(
        (contact) => contact.id === payload.id && contact.socketId
      );

      if (!isContactExists) {
        this.$store
          .dispatch("notifications/addNotification", {
            title: "Contact Request",
            body: `${payload.id} sent you a contact request.`,
            time: new Date(),
            actions: [
              {
                label: "Delete",
                dispatch: "notifications/removeNotification",
                data: payload,
              },
              {
                label: "Accept",
                dispatch: "contacts/acceptContactRequest",
                data: payload,
              },
            ],
          })
          .then(() => {
            $play("notify");
            this.$store.dispatch("app/setAlert", {
              title: "Contact Request",
              body: `You have new contact request from ${payload.id}.`,
              color: "blue",
            });
          });
      }
    });

    $socket.on("contact not found", (request) => {
      this.$store.dispatch("contacts/removeContact", request).then(() => {
        this.$store.dispatch("app/setAlert", {
          title: "Error",
          body: "Contact not found.",
          color: "red",
        });
      });
    });

    $socket.on("request accepted", (payload) => {
      this.$store.dispatch("contacts/addContact", payload).then(() => {
        this.$store
          .dispatch("notifications/addNotification", {
            title: "Request Accepted",
            body: `${payload.name} accepted your contact request.`,
            time: new Date(),
          })
          .then(() => {
            $play("notify");
            this.$store.dispatch("app/setAlert", {
              title: "Contact Request",
              body: `${payload.name} accepted your contact request.`,
              color: "green",
            });
          });
      });
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
    $play,
  },
};
</script>
