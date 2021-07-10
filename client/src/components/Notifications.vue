<template>
  <div class="space-y-4">
    <div class="flex items-end space-x-2 justify-between">
      <h2 class="text-xl font-bold py-2">Notifications</h2>
      <button
        v-if="notifications.length"
        class="p-2 text-blue-400 text-xs"
        @click="$store.dispatch('notifications/removeAllNotifications')"
      >
        Clear all
      </button>
    </div>
    <div class="space-y-2">
      <notification
        :info="notification"
        v-for="(notification, index) in notifications"
        :key="index"
      />
    </div>
    <p class="italic text-sm h-full flex" v-if="!notifications.length">
      There are no any notifications
    </p>
  </div>
</template>

<script>
import Notification from "./Notification.vue";

export default {
  components: { Notification },
  computed: {
    notifications() {
      return this.$store.getters["notifications/all"];
    },
  },
  mounted() {
    this.$store.dispatch("notifications/readAllNotifications");
  },
};
</script>