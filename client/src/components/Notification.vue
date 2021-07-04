<template>
  <div class="shadow rounded-lg p-4 flex space-x-4 w-full">
    <ui-icon name="notification" />
    <div class="space-y-1">
      <strong>{{ info.title }}</strong>
      <div class="space-y-1">
        <p class="text-sm">{{ info.body }}</p>
        <span class="flex-shrink-0 text-xs text-blue-400 italic">{{
          $time(info.time)
        }}</span>
      </div>
      <div v-if="info.actions" class="flex space-x-4 border-t pt-2">
        <ui-button
          size="sm"
          @click="$store.dispatch(action.dispatch, action.data)"
          v-for="(action, index) in info.actions"
          :color="index > 0 ? 'green' : 'red'"
          :key="index"
          >{{ action.label }}</ui-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from "./ui/UiButton.vue";
import UiIcon from "./ui/UiIcon.vue";
import { $time } from "../utils";
export default {
  components: { UiIcon, UiButton },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    $time,
  },
};
</script>
