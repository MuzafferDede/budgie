<template>
  <div class="bg-gray-700 p-4 h-full rounded-lg space-y-4 overflow-auto">
    <div class="flex flex-col w-full" v-show="connected">
      <div class="p-2 w-full" v-show="connected">
        <video
          class="w-full h-full object-cover rounded-lg"
          ref="partner"
          @loadedmetadata="$event.target.play()"
        />
      </div>
      <div class="p-2 w-full">
        <video
          muted
          class="w-full h-full object-cover rounded-lg"
          ref="self"
          @loadedmetadata="$event.target.play()"
        />
      </div>
    </div>
    <div class="space-y-4 w-full p-8 self-center">
      <div class="flex justify-center items-center">
        <div
          class="
            p-4
            rounded-full
            bg-white
            text-gray-900
            shadow-lg
            ring-2 ring-gray-200
          "
          :class="{ 'animate-bounce': !connected }"
        >
          <ui-icon name="avatar" size="3xl" />
        </div>
      </div>
      <span class="flex flex-col items-center text-white">
        <span class="text-lg">{{ contact.name }}</span>
        <span v-if="!connected" class="text-sm">Video calling...</span>
      </span>
      <div class="flex justify-center space-x-4">
        <div class="w-auto" v-if="caller && !connected">
          <ui-button @click="answer" class="animate-pulse">
            <ui-icon name="call" />
          </ui-button>
        </div>
        <div class="w-auto">
          <ui-button @click="hang" color="red">
            <ui-icon name="call" class="transform rotate-180" />
          </ui-button>
        </div>
      </div>
      <div class="flex justify-center space-x-4 text-white" v-if="connected">
        <div class="w-auto">
          <ui-button
            class="relative"
            @click="toggleSound('partner')"
            color="none"
            :class="{ 'text-gray-400': !partner.audio }"
          >
            <ui-icon name="mic" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="!partner.audio"
            />
          </ui-button>
        </div>
        <div class="w-auto">
          <ui-button
            @click="toggleSound('self')"
            color="none"
            class="relative"
            :class="{ 'text-gray-400': !self.audio }"
          >
            <ui-icon name="volume" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="!self.audio"
            />
          </ui-button>
        </div>
        <div class="w-auto">
          <ui-button
            class="relative"
            @click="toggleVideo('self')"
            color="none"
            :class="{ 'text-gray-400': !self.video }"
          >
            <ui-icon name="video" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="!self.video"
            />
          </ui-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { $socket, $play } from "../utils";
import UiButton from "./ui/UiButton.vue";
import UiIcon from "./ui/UiIcon.vue";

const config = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

export default {
  components: { UiButton, UiIcon },
  data() {
    return {
      RTC: undefined,
      calling: false,
      connected: false,
      self: {
        audio: true,
        video: true,
      },
      partner: {
        audio: true,
        video: true,
      },
    };
  },
  computed: {
    contact() {
      return this.$store.getters["contacts/contact"];
    },
    callTriger() {
      return this.$store.getters["app/callTriger"];
    },
    caller() {
      return this.$store.getters["app/offer"];
    },
  },
  watch: {
    callTriger(value) {
      if (this[value]) {
        this[value]();
      }
    },
  },
  mounted() {
    $socket.on("candidate", (payload) => {
      if (this.RTC) {
        this.RTC.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    });

    $socket.on("answer", (payload) => {
      this.RTC.setRemoteDescription(
        new RTCSessionDescription(payload.answer)
      ).then(() => {
        $play("ringtone", false, false);

        this.connected = true;

        this.calling = true;
      });
    });

    $socket.on("hang", () => {
      this.handleHang();
    });

    $socket.on("leave", () => {
      this.handleHang();
    });
  },
  beforeUnmount() {
    $socket.removeAllListeners("candidate");
    $socket.removeAllListeners("answer");
    $socket.removeAllListeners("hang");
    $socket.removeAllListeners("leave");
  },
  methods: {
    toggleSound(target) {
      this.$refs[target].srcObject.getTracks().forEach((t) => {
        if (t.kind === "audio") {
          t.enabled = !t.enabled;
          this[target].audio = t.enabled;
        }
      });
    },
    toggleVideo(target) {
      this.$refs[target].srcObject.getTracks().forEach((t) => {
        if (t.kind === "video") {
          t.enabled = !t.enabled;
          this[target].video = t.enabled;
        }
      });
    },
    audioCall() {},
    answer() {
      this.prepare().then(() => {
        this.RTC.setRemoteDescription(
          new RTCSessionDescription(this.caller.offer)
        ).then(() => {
          this.RTC.createAnswer()
            .then((answer) => {
              this.RTC.setLocalDescription(answer);

              this.send("answer", { answer });

              this.connected = true;

              $play("ringtone", false, false);
            })
            .catch((error) => {
              this.$log(error);
            });
        });
      });
    },
    createPeerOffer() {
      this.RTC.createOffer()
        .then((offer) => {
          this.send("offer", { offer });

          this.RTC.setLocalDescription(offer).then(() => {
            $play("ringtone", true);
          });
        })
        .catch((error) => {
          this.$log(error);
        });
    },
    handleHang() {
      if (this.connected) {
        this.$refs.partner.srcObject = undefined;

        this.$refs.self.srcObject = undefined;

        this.RTC.close();
      }

      this.RTC = undefined;

      $play("ringtone", false, false);

      this.calling = false;

      this.connected = false;

      this.$store.dispatch("app/setPanel", undefined).then(() => {
        this.$store.dispatch("app/setOffer", undefined);
      });
    },
    hang() {
      this.handleHang();

      this.send("hang");
    },
    prepare() {
      return navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.$refs.self.srcObject = stream;

          this.RTC = new RTCPeerConnection(config);

          stream
            .getTracks()
            .forEach((track) => this.RTC.addTrack(track, stream));

          this.RTC.ontrack = (event) => {
            // Don't set srcObject again if it is already set.
            if (this.$refs.partner.srcObject) return;

            this.$refs.partner.srcObject = event.streams[0];
          };
          this.RTC.onicecandidate = (event) => {
            if (event.candidate) {
              this.send("candidate", {
                candidate: event.candidate,
              });
            }
          };
        })
        .catch((error) => {
          this.$log("error at preapering", error);
        });
    },
    send(type, data) {
      data = { ...data, contact: this.contact.id };
      $socket.emit(type, data);
    },
    videoCall() {
      this.calling = true;
      this.prepare().then(() => {
        this.createPeerOffer();
      });
    },
  },
};
</script>
