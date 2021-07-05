<template>
  <div class="flex w-full divide-x">
    <contacts v-if="contacts.length" />
    <ui-transition animation="scale">
      <div
        class="w-full flex-1 flex flex-col bg-gray-50 min-w-min divide-y"
        v-if="contact"
      >
        <div class="p-3.5 bg-white flex items-center justify-between">
          <h2 class="text-2xl text-gray-900">{{ contact.name }}</h2>
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-2" v-if="panel !== 'Call'">
              <button
                class="
                  p-2
                  hover:bg-gray-100
                  rounded-full
                  relative
                  shadow-md
                  transition-all
                  duration-150
                "
              >
                <ui-icon name="call" />
              </button>
              <button
                class="
                  p-2
                  hover:bg-gray-100
                  rounded-full
                  relative
                  shadow-md
                  transition-all
                  duration-150
                "
                @click="startCall"
              >
                <ui-icon name="video" />
              </button>
            </div>
            <button
              class="
                p-2
                hover:bg-gray-100
                rounded-full
                relative
                transition-all
                duration-150
              "
              :class="{ 'rotate-90': showDetail }"
              @click="showDetail = !showDetail"
            >
              <ui-icon name="options" />
            </button>
          </div>
        </div>
        <messages />
        <texter />
      </div>
    </ui-transition>
    <ui-transition animation="slide">
      <contact-detail v-if="showDetail && contact" />
    </ui-transition>
    <div></div>
  </div>
</template>

<script>
import UiIcon from "./ui/UiIcon.vue";
import Messages from "./Messages.vue";
import Texter from "./Texter.vue";
import ContactDetail from "./ContactDetail.vue";
import UiTransition from "./ui/UiTransition.vue";
import Contacts from "./Contacts.vue";

import { $play, $socket } from "../utils";

export default {
  components: {
    UiIcon,
    Messages,
    Texter,
    ContactDetail,
    UiTransition,
    Contacts,
  },
  data() {
    return {
      showDetail: false,
    };
  },
  computed: {
    contacts() {
      return this.$store.getters["contacts/confirmed"];
    },
    contact() {
      return this.$store.getters["contacts/contact"];
    },
    user() {
      return this.$store.getters["client/user"];
    },
    panel() {
      return this.$store.getters["app/panel"];
    },
  },
  methods: {
    startCall() {
      this.$store.dispatch("app/setPanel", "Call").then(() => {
        this.$store
          .dispatch("app/setOnCall", { with: this.contact })
          .then(() => {
            $socket.emit("calling", {
              contact: this.contact.id,
              caller: this.user,
            });
            $play("ringtone", true);
          });
      });
    },
  },
};
</script>
