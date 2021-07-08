<template>
  <div class="bg-gray-700 p-4 h-full rounded-lg space-y-4 overflow-auto">
    <div class="flex flex-col w-full" v-show="connected">
      <div class="p-2 w-full relative">
        <video
          class="
            w-full
            h-full
            object-cover
            rounded-lg
            bg-gray-500
            transform
            -scale-x-1
          "
          ref="partner"
          @loadedmetadata="$event.target.play()"
        />
        <div
          class="
            flex
            justify-center
            space-x-4
            absolute
            bottom-0
            right-0
            m-4
            text-white
          "
        >
          <div class="w-auto">
            <button
              title="Switch to full screen"
              class="relative"
              @click="$refs.partner.requestFullscreen()"
              v-if="onCall.video"
            >
              <ui-icon name="fullscreen" />
            </button>
          </div>
          <div class="w-auto">
            <button
              title="Mute audio"
              class="relative"
              @click="toggleMedia('partner', 'audio')"
            >
              <ui-icon name="volume" />
              <ui-icon
                name="close"
                class="absolute inset-0 h-full w-full text-red-500"
                size="none"
                v-if="!partner.audio"
              />
            </button>
          </div>
        </div>
      </div>
      <div
        class="p-2 w-full relative"
        :class="{ 'h-0 w-0 overflow-hidden': !onCall.video }"
      >
        <video
          controls="false"
          muted
          class="
            w-full
            h-full
            object-cover
            rounded-lg
            bg-gray-500
            transform
            -scale-x-1
          "
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
        <span>{{ timer }}</span>
        <span v-if="!connected" class="text-sm"
          >{{ onCall.video ? "Video" : "" }} Calling...</span
        >
      </span>
      <div class="flex justify-center space-x-4">
        <div class="w-auto" v-if="!onCall.caller && !connected">
          <ui-button title="Answer" @click="offer" class="animate-pulse">
            <ui-icon name="call" />
          </ui-button>
        </div>
        <div class="w-auto">
          <ui-button title="Hang up" @click="hang" color="red">
            <ui-icon name="call" class="transform rotate-180" />
          </ui-button>
        </div>
      </div>
      <div class="flex justify-center space-x-4 text-white">
        <div class="w-auto" v-if="!connected">
          <ui-button
            title="Silence"
            class="relative"
            @click="setSilence"
            color="none"
            :class="{ 'text-gray-400': silence }"
          >
            <ui-icon name="silence" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="silence"
            />
          </ui-button>
        </div>
        <div class="w-auto" v-if="connected">
          <ui-button
            title="Mute your microphone"
            @click="toggleMedia('self', 'audio')"
            color="none"
            class="relative"
            :class="{ 'text-gray-400': !self.audio }"
          >
            <ui-icon name="mic" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="!self.audio"
            />
          </ui-button>
        </div>
        <div class="w-auto" v-if="connected">
          <ui-button
            title="Turn off your camera"
            class="relative"
            @click="toggleMedia('self', 'video')"
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
import { $socket, $play, $moment } from "../utils";
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
      silence: false,
      sessionStream: undefined,
      duration: 0,
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
    config() {
      return {
        video: this.onCall.video
          ? {
              mandatory: {
                minWidth: 320,
                maxWidth: 1280,
                minHeight: 180,
                maxHeight: 720,
                minFrameRate: 30,
              },
            }
          : false,
        audio: true,
      };
    },
    timer() {
      return this.connected
        ? $moment(this.connected)
            .utc()
            .add(this.duration, "seconds")
            .format("HH:mm:ss")
        : false;
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
      this.hang();
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
    $socket.removeAllListeners("offer");
  },
  methods: {
    answer() {
      this.RTC.createAnswer()
        .then((answer) => {
          this.RTC.setLocalDescription(answer).then(() => {
            this.send("answer", { answer });

            this.callStarted();

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

            this.callStarted();

            $play("ringtone", false, false);
          });
        })
        .catch((error) => {
          this.$log(error);
        });
    },
    hang() {
      $play("hang");

      if (this.connected) {
        this.connected = false;

        this.sessionStream.getTracks().forEach((track) => {
          track.stop();
        });

        this.RTC.close();
      }

      this.RTC = undefined;

      this.calling = false;

      this.$store.dispatch("app/setPanel", undefined).then(() => {
        this.$store.dispatch("app/setOnCall", {});
        $socket.removeAllListeners("hang");
      });

      this.send("hang");
    },
    prepare() {
      return navigator.mediaDevices
        .getUserMedia(this.config)
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
    setSilence() {
      $play("ringtone", false, false);
      this.silence = true;
    },
    toggleMedia(target, media) {
      this.$refs[target].srcObject.getTracks().forEach((t) => {
        if (t.kind === media) {
          t.enabled = !t.enabled;
          this[target].audio = t.enabled;
        }
      });
    },
    callStarted() {
      this.connected = 1;

      setInterval(() => {
        this.duration++;
      }, 1000);
    },
  },
};
</script>

