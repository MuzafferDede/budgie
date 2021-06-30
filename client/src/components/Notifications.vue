<template>
  <div class="divide-y">
    <div class="p-4" v-for="notification in 10" :key="notification.id">
      notification
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    notifications() {
      return this.$store.getters["notifications/all"];
    },
  },
};
</script>
