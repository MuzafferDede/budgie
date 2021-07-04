<template>
  <transition
    :enter-from-class="transition[animation].enterFrom"
    :enter-active-class="`transition-all ease-in-out ${duration.in}`"
    :enter-to-class="transition[animation].enterTo"
    :leave-from-class="transition[animation].leaveFrom"
    :leave-active-class="`transition-all ease-in-out ${duration.out}`"
    :leave-to-class="transition[animation].leaveTo"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  props: {
    animation: {
      type: String,
      default: "fade",
    },
    duration: {
      type: Object,
      default: () => {
        return { in: "duration-300", out: "duration-75" };
      },
    },
  },
  computed: {
    transition() {
      return {
        fade: {
          enterFrom: "opacity-0",
          enterTo: "opacity-100",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
        },
        translate: {
          enterFrom: "transform opacity-0 -translate-y-4",
          enterTo: "transform opacity-100 translate-y-0",
          leaveFrom: "transform opacity-100 translate-y-0",
          leaveTo: "transform opacity-0 -translate-y-4",
        },
        "translate-reverse": {
          enterFrom: "transform opacity-0 translate-y-4",
          enterTo: "transform opacity-100 -translate-y-0",
          leaveFrom: "transform opacity-100 -translate-y-0",
          leaveTo: "transform opacity-0 translate-y-4",
        },
        pull: {
          enterFrom: "transform opacity-0 translate-y-full",
          enterTo: "transform opacity-100 translate-y-0",
          leaveFrom: "transform opacity-100 translate-y-0",
          leaveTo: "transform opacity-0 translate-y-full",
        },
        slide: {
          enterFrom: "transform opacity-0 translate-x-full",
          enterTo: "transform opacity-100 translate-x-0",
          leaveFrom: "transform opacity-100 translate-x-0",
          leaveTo: "transform opacity-0 translate-x-full",
        },
        scale: {
          enterFrom: "transform opacity-0 scale-95",
          enterTo: "transform opacity-100 scale-100",
          leaveFrom: "transform opacity-100 scale-100",
          leaveTo: "transform opacity-0 scale-95",
        },
      };
    },
  },
};
</script>
