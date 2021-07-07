<template>
  <div class="w-full space-y-4 p-3">
    <input
      type="text "
      placeholder="Enter contact ID here"
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
      <ui-button @click="addContact">Add Contact</ui-button>
    </div>
    <div class="flex flex-col space-y-4">
      <ui-button @click="$store.dispatch('contacts/removeAllContacts')"
        >Delete All
      </ui-button>
    </div>
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
import UiTransition from "./ui/UiTransition.vue";
import { $socket } from "../utils";

export default {
  components: { UiTransition, UiButton },
  data() {
    return {
      error: undefined,
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
  },
  methods: {
    addContact() {
      if (this.contacts.find((contact) => contact.id === this.contactId)) {
        return this.$store.dispatch("app/setAlert", {
          title: "Error",
          body: "This contact already exists.",
          color: "red",
        });
      }

      if (!this.contactId || this.contactId === this.user.id) {
        return this.$store.dispatch("app/setAlert", {
          title: "Error",
          body: "Wrong Contact ID format, please try again.",
          color: "red",
        });
      }

      this.$store
        .dispatch("contacts/addContact", {
          id: this.contactId,
          name: "Pending",
        })
        .then(() => {
          $socket.emit("add contact", this.contactId);

          this.contactId = undefined;
        })
        .then(() => {
          this.$store.dispatch("app/setAlert", {
            title: "Sent",
            body: "Your request has been sent",
            color: "green",
          });
        })
        .then(() => {
          this.$store.dispatch("app/setPanel", undefined);
        });
    },
  },
};
</script>
