<template>
  <div class="space-y-4 p-4 w-full flex flex-col overflow-hidden">
    <h2 class="font-bold">Contacts</h2>
    <div class="w-full space-y-4">
      <ui-button @click="showAddContact = true">Add</ui-button>
      <div
        v-if="showAddContact"
        class="
          bg-black bg-opacity-80
          fixed
          z-30
          inset-0
          flex
          items-center
          justify-center
        "
      >
        <div class="bg-white rounded shadow p-4 lg:w-96">
          <div class="flex flex-col gap-4">
            <label for="contact"> Contact ID </label>
            <input
              class="p-4 ring-2 rounded"
              placeholder="xxxxxxxx-xxxxxx-xxxxxxxxx"
              type="text"
              name="contact"
              id="contact"
              v-model="contact"
            />
            <p v-if="error" class="text-red-500">{{ error }}</p>
            <div class="flex space-x-4">
              <ui-button
                class="w-full"
                @click="(showAddContact = false), (contact = undefined)"
                color="blue"
                >Cancel</ui-button
              >
              <ui-button
                @click="addContact"
                class="w-full"
                :class="{
                  'animate-ping': sent,
                  'opacity-75 pointer-events-none': !contact,
                }"
                >{{ sent ? "Sent" : "Request" }}</ui-button
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="
          bg-gray-400
          text-white text-xs
          p-3
          rounded
          flex
          justify-between
          items-center
        "
        v-for="request in requests"
        :key="request.id"
      >
        <span>{{ request.name }}</span>
        <div class="ml-auto flex space-x-2 items-center">
          <ui-button @click="accept(request)">Accept</ui-button>
          <ui-button color="red" @click="reject(request)">Reject</ui-button>
        </div>
      </div>
    </div>
    <div class="w-full space-y-4 overflow-auto">
      <div
        class="
          bg-gray-100
          cursor-pointer
          group
          rounded
          p-3
          w-full
          text-gray-700
          font-semibold
          flex
          justify-start
          gap-1
          items-center
        "
        v-for="contact in contacts"
        :key="contact.id"
        @click="$emit('set-contact', contact.id)"
      >
        <span class="inline-block bg-green-400 rounded-full h-2 w-2"></span>
        <span
          >{{ contact.name }}
          <span
          v-if="notSeen(contact.id)"
            class="
              bg-red-500
              text-white text-xs
              rounded-full
              w-5
              h-5
              inline-flex
              items-center
              justify-center
            "
            >{{ notSeen(contact.id) }}</span
          ></span
        >
        <div class="ml-auto flex items-center space-x-2">
          <ui-button
            class="text-xs hidden group-hover:block"
            color="red"
            size="sm"
            @click="$store.dispatch('contacts/delete', contact)"
            >Remove</ui-button
          >
          <span
            class="italic text-sm text-gray-400 animate-pulse"
            v-if="isTyping(contact.id)"
            >typing...</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
export default {
  components: { UiButton },
  data() {
    return {
      showAddContact: false,
      sent: false,
      contact: undefined,
      error: undefined,
    };
  },
  props: {
    typers: {
      type: Array,
      default: () => [],
    },
    messages: {
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
    notSeen() {
      return (id) => {
        return this.messages.filter(message => message.new).reduce((current, next) => {
          next.user.id === id && current++
          
          return current;
        }, 0);
      };
    },
    contacts() {
      return this.$store.getters["contacts/contacts"].items || [];
    },
    requests() {
      return this.$store.getters["requests/requests"].items || [];
    },
  },
  mounted() {
    this.socket.on("contact request", (contact) => {
      this.$store.dispatch("requests/save", contact);
    });

    this.socket.on("request accepted", (contact) => {
      this.$store.dispatch("contacts/save", contact);
    });
  },
  methods: {
    addContact() {
      if (
        !this.contact ||
        this.contact === this.$store.getters["client/user"].id
      ) {
        this.error = "We could not add this user";
        return;
      }

      this.socket.emit("add contact", this.contact);
      this.sent = true;
      this.contact = undefined;

      setTimeout(() => {
        this.showAddContact = false;
        this.sent = false;
      }, 500);
    },
    accept(request) {
      this.socket.emit("accept request", request.id);
      this.$store.dispatch("contacts/save", request);
      this.$store.dispatch("requests/delete", request);
    },
    reject(request) {
      this.$store.dispatch("requests/delete", request);
    },
  },
};
</script>
