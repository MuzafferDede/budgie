<template>
  <div class="flex w-full divide-x">
    <contacts />
    <ui-transition animation="scale">
      <div
        class="w-full flex-1 flex flex-col bg-gray-50 min-w-min divide-y"
        v-if="contact"
      >
        <div
          class="
            p-2.5
            bg-white
            flex flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            space-y-2
            lg:space-y-0
          "
        >
          <div class="flex space-x-2 items-center">
            <div class="w-auto flex-0">
              <ui-button
                color="white"
                @click="
                  $store.dispatch('contacts/setCurrentContact', undefined)
                "
              >
                <ui-icon name="arrow" class="transform rotate-90" />
              </ui-button>
            </div>
            <h2 class="text-2xl text-gray-900">{{ contact.name }}</h2>
          </div>
          <div class="flex items-center space-x-2 justify-end">
            <div class="flex items-center space-x-2">
              <ui-button
                title="Start audio call"
                color="white"
                v-if="!onCall.with"
                @click="startCall()"
              >
                <ui-icon name="call" />
              </ui-button>
              <ui-button
                title="Start video call"
                color="white"
                v-if="!onCall.with"
                @click="startCall(true)"
              >
                <ui-icon name="video" />
              </ui-button>
              <ui-button
                title="Current call"
                color="blue"
                class="animate-bounce"
                v-if="
                  onCall.with &&
                  contact.id === onCall.with.id &&
                  panel !== 'Call'
                "
                @click="$store.dispatch('app/setPanel', 'Call')"
              >
                <ui-icon name="call" />
              </ui-button>
            </div>
            <div class="w-auto">
              <ui-button
                title="Contact details"
                color="white"
                :class="{ 'rotate-90': showDetail }"
                @click="showDetail = !showDetail"
              >
                <ui-icon name="options" />
              </ui-button>
            </div>
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
import UiButton from "./ui/UiButton.vue";

export default {
  components: {
    UiIcon,
    Messages,
    Texter,
    ContactDetail,
    UiTransition,
    Contacts,
    UiButton,
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
    onCall() {
      return this.$store.getters["app/onCall"];
    },
  },
  methods: {
    startCall(video = false) {
      this.$store
        .dispatch("app/setOnCall", {
          with: this.contact,
          caller: true,
          video: video,
        })
        .then(() => {
          this.$store.dispatch("app/setPanel", "Call").then(() => {
            $socket.emit("calling", {
              contact: this.contact.id,
              caller: this.user,
              video: video,
            });
            $play("ringtone", true);
          });
        });
    },
  },
};
</script>
