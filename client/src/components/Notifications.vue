<template>
  <div class="space-y-4">
    <h2 class="text-2xl">Notifications</h2>
    <div
      class="
        p-4
        flex flex-col
        space-y-4
        justify-between
        items-center
        group
        hover:bg-gray-50
      "
      v-for="(request, index) in requests"
      :key="index"
    >
      <div>
        <p>{{ request.id }}</p>
        <p class="text-xs">{{ $time(request.time) }}</p>
        <p class="text-xs">{{ request.name }}</p>
      </div>
      <div class="flex space-x-2 items-center w-full">
        <ui-button @click="cancel(request)" size="sm" color="red">
          Delete
        </ui-button>
        <ui-button @click="accept(request)" size="sm"> Accept </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
import { $time, $socket } from "../utils";
export default {
  components: { UiButton },
  computed: {
    requests() {
      return this.$store.getters["requests/all"];
    },
  },
  methods: {
    $time,
    accept(request) {
      $socket.emit("accept request", request.id);

      this.$store.dispatch("contacts/addContact", request);
    },
    cancel(request) {
      $socket.emit("cancel request", request.id);

      this.$store.dispatch("requests/removeRequest", request);
    },
  },
};
</script>
