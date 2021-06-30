<template>
  <compoment :is="currentIcon" :class="dimension" class="flex-shrink-0" />
</template>

<script>
import arrowDown from "../../assets/icons/svg/arrow-down.svg";
import check from "../../assets/icons/svg/check.svg";
import contacts from "../../assets/icons/svg/contacts.svg";
import logo from "../../assets/icons/svg/logo.svg";
import notification from "../../assets/icons/svg/notification.svg";
import options from "../../assets/icons/svg/options.svg";
import user from "../../assets/icons/svg/user.svg";
import send from "../../assets/icons/svg/send.svg";

const icons = {
  check,
  contacts,
  "arrow-down": arrowDown,
  logo,
  notification,
  options,
  user,
  send,
};
const dimensions = {
  none: "",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8 ",
  xl: "w-10 h-10",
  "2xl": "w-12 h-12",
  "3xl": "w-16 h-16",
  "4xl": "w-20 h-20",
};

export default {
  props: {
    name: {
      type: String,
      default: undefined,
    },
    size: {
      type: String,
      default: "md",
    },
  },
  computed: {
    // assign width and height of the icon
    dimension() {
      return dimensions[this.size];
    },
    currentIcon() {
      return icons[this.name];
    },
  },
};
</script>
