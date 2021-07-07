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
        <span class="text-lg" v-if="onCall.with">{{ onCall.with.name }}</span>
        <span v-if="!connected" class="text-sm">Video calling...</span>
      </span>
      <div class="flex justify-center space-x-4">
        <div class="w-auto" v-if="!onCall.caller && !connected">
          <ui-button @click="offer" class="animate-pulse">
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

/* globals App, io, cabin*/
const ICE_SERVERS = [
  {
    urls: ["stun:stun.stunprotocol.org"],
  },
  {
    urls: "turn:numb.viagenie.ca",
    username: "muazkh",
    credential: "webrtc@live.com",
  },
];

export default {
  components: { UiButton, UiIcon },
  data() {
    return {
      RTC: undefined,
      calling: false,
      connected: false,
      sessionStream: undefined,
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
    onCall() {
      return this.$store.getters["app/onCall"];
    },
  },
  mounted() {
    this.prepare();
    $socket.on("answer", (payload) => {
      this.RTC.setRemoteDescription(
        new RTCSessionDescription(payload.answer)
      ).catch((error) => this.$log("answer error", error));
    });

    $socket.on("candidate", (payload) => {
      this.RTC.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(
        (error) => this.$log("candidate error", error)
      );
    });

    $socket.on("hang", () => {
      this.handleHang();
    });

    $socket.on("leave", () => {
      this.handleHang();
    });

    $socket.on("offer", (payload) => {
      this.RTC.setRemoteDescription(new RTCSessionDescription(payload.offer))
        .then(() => {
          this.answer();
        })
        .catch((error) => this.$log("offer error", error));
    });
  },
  beforeUnmount() {
    $socket.removeAllListeners("answer");
    $socket.removeAllListeners("candidate");
    $socket.removeAllListeners("hang");
    $socket.removeAllListeners("leave");
    $socket.removeAllListeners("offer");
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
      this.RTC.createAnswer()
        .then((answer) => {
          this.RTC.setLocalDescription(answer).then(() => {
            this.send("answer", { answer });

            this.connected = true;

            $play("ringtone", false, false);
          });
        })
        .catch((error) => {
          this.$log(error);
        });
    },
    offer() {
      this.RTC.createOffer()
        .then((offer) => {
          this.RTC.setLocalDescription(offer).then(() => {
            this.send("offer", { offer });

            this.connected = true;

            $play("ringtone", false, false);
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

        this.sessionStream.getTracks().forEach((track) => {
          track.stop();
        });

        this.RTC.close();
      }

      this.RTC = undefined;

      $play("ringtone", false, false);

      this.calling = false;

      this.connected = false;

      this.$store.dispatch("app/setPanel", undefined).then(() => {
        this.$store.dispatch("app/setOnCall", {});
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
          this.sessionStream = stream;

          this.$refs.self.srcObject = this.sessionStream;

          this.RTC = new RTCPeerConnection(
            { iceServers: ICE_SERVERS },
            { optional: [{ DtlsSrtpKeyAgreement: true }] }
          );

          this.RTC.ontrack = (event) => {
            this.$refs.partner.srcObject = event.streams[0];
          };

          this.sessionStream
            .getTracks()
            .forEach((track) => this.RTC.addTrack(track, this.sessionStream));

          this.RTC.onicecandidate = (event) => {
            if (event.candidate) {
              this.send("candidate", {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                candidate: event.candidate,
              });
            }
          };
        })
        .catch((error) => {
          console.log("error at preparing", error);
        });
    },
    send(type, data) {
      data = { ...data, contact: this.onCall.with.id };
      $socket.emit(type, data);
    },
    videoCall() {
      this.calling = true;
      this.prepare().then(() => {
        this.offer();
      });
    },
  },
};
</script>

