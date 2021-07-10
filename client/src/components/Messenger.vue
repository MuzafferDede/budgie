<template>
  <div class="h-screen overflow-hidden bg-white flex w-full">
    <side-panel />
    <div
      class="w-full flex-col overflow-hidden lg:flex"
      :class="{ hidden: panel, flex: !panel }"
    >
      <div class="border-b flex items-center justify-between flex-none">
        <h1 class="hidden lg:block text-2xl p-4 text-gray-900">Budgie</h1>
        <div class="w-full lg:w-80 flex lg:space-x-4 relative p-4">
          <div class="group">
            <ui-button
              title="Show notifications"
              color="white"
              class="relative"
              :class="{
                'bg-gray-100': panel === 'Notifications',
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
            </ui-button>
          </div>
          <div class="pl-4 lg:border-l lg:w-full ml-auto">
            <button
              title="Profile"
              class="flex w-full space-x-2 items-center text-left group"
              @click="$store.dispatch('app/setPanel', 'Profile')"
            >
              <span
                class="
                  rounded-full
                  bg-white
                  group-hover:bg-gray-100
                  shadow
                  px-3
                  py-3
                  text-lg
                "
                :class="{
                  'bg-gray-100': panel === 'Profile',
                }"
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
      <div class="flex flex-1 divide-x overflow-auto">
        <conversation />
      </div>
    </div>
    <ui-transition animation="slide">
      <div
        class="space-y-4 bg-white z-30 w-full lg:max-w-sm shadow p-4 relative"
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
import { $play, $socket, $notify } from "../utils";
import UiIcon from "./ui/UiIcon.vue";
import Conversation from "./Conversation.vue";
import ContactList from "./ContactList.vue";
import UiTransition from "./ui/UiTransition.vue";
import Notifications from "./Notifications.vue";
import Profile from "./Profile.vue";
import SidePanel from "./SidePanel.vue";
import Call from "./Call.vue";
import UiButton from "./ui/UiButton.vue";

export default {
  components: {
    ContactList,
    Conversation,
    UiTransition,
    UiIcon,
    Notifications,
    Profile,
    SidePanel,
    Call,
    UiButton,
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
  beforeCreate() {
    this.$store.dispatch("app/setPanel", undefined).then(() => {
      const onCall = this.$store.getters["app/onCall"];

      if (onCall.with) {
        $socket.emit("hang", { contact: onCall.with.id });

        this.$store.dispatch("app/setOnCall", {});
      }
    });
  },
  mounted() {
    $socket.on("calling", (payload) => {
      this.$store
        .dispatch("app/setOnCall", {
          with: payload.caller,
          video: payload.video,
        })
        .then(() => {
          this.$store.dispatch("app/setPanel", "Call");
          $play("ringtone", true);
        });
    });

    $socket.on("contact request", (payload) => {
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

        $play("message");
      }

      this.$store.dispatch("messages/addMessage", data).then(() => {
        $notify({
          title: this.$store.getters["contacts/find"](data.sender).name,
          body: data.body,
        });
      });
    });
  },
  beforeUnmount() {
    $socket.removeAllListeners("calling");
    $socket.removeAllListeners("contact request");
    $socket.removeAllListeners("contact not found");
    $socket.removeAllListeners("request accepted");
    $socket.removeAllListeners("new message");
  },
  methods: {
    $play,
  },
};
</script>
