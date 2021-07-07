<template>
  <compoment class="flex-shrink-0" :is="currentIcon" :class="dimension" />
</template>

<script>
import avatar from "../../assets/icons/svg/avatar.svg";
import arrow from "../../assets/icons/svg/arrow.svg";
import call from "../../assets/icons/svg/call.svg";
import check from "../../assets/icons/svg/check.svg";
import close from "../../assets/icons/svg/close.svg";
import contacts from "../../assets/icons/svg/contacts.svg";
import fullscreen from "../../assets/icons/svg/fullscreen.svg";
import hang from "../../assets/icons/svg/hang.svg";
import notification from "../../assets/icons/svg/notification.svg";
import mic from "../../assets/icons/svg/mic.svg";
import mute from "../../assets/icons/svg/mute.svg";
import options from "../../assets/icons/svg/options.svg";
import user from "../../assets/icons/svg/user.svg";
import send from "../../assets/icons/svg/send.svg";
import video from "../../assets/icons/svg/video.svg";
import volume from "../../assets/icons/svg/volume.svg";

const icons = {
  avatar,
  arrow,
  call,
  check,
  close,
  contacts,
  fullscreen,
  hang,
  notification,
  mic,
  mute,
  options,
  user,
  send,
  video,
  volume,
};

const dimensions = {
  none: "",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  DEFAULT: "w-6 h-6",
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
      default: "DEFAULT",
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
