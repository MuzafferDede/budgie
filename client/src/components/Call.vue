<template>
  <div class="bg-gray-700 h-full rounded-lg space-y-4 overflow-auto">
    <div class="flex flex-col w-full relative" v-show="call.connected">
      <div class="w-full relative">
        <video
          class="w-full h-full object-cover bg-gray-500 transform -scale-x-1"
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
              v-if="call.video"
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
                v-if="!call.partner.audio"
              />
            </button>
          </div>
        </div>
      </div>
      <div
        class="w-32 absolute top-0 right-0 z-10 border m-2"
        :class="{ 'h-0 w-0 overflow-hidden': !call.video }"
      >
        <video
          controls="false"
          muted
          class="w-full h-full object-cover bg-gray-500 transform -scale-x-1"
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
          :class="{ 'animate-bounce': !call.connected }"
        >
          <ui-icon name="avatar" size="3xl" />
        </div>
      </div>
      <span class="flex flex-col items-center text-white">
        <span class="text-lg" v-if="call.with">{{ call.with.name }}</span>
        <span v-if="call.connected">{{ timer }}</span>
        <span v-if="!call.connected" class="text-sm"
          >{{ call.video ? "Video" : "" }} Calling...</span
        >
      </span>
      <div class="flex justify-center space-x-4">
        <div class="w-auto" v-if="!call.caller && !call.connected">
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
        <div class="w-auto" v-if="!call.connected">
          <ui-button
            title="Silence"
            class="relative"
            @click="setSilence"
            color="none"
            :class="{ 'text-gray-400': call.silence }"
          >
            <ui-icon name="silence" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="call.silence"
            />
          </ui-button>
        </div>
        <div class="w-auto" v-if="call.connected">
          <ui-button
            title="Mute your microphone"
            @click="toggleMedia('self', 'audio')"
            color="none"
            class="relative"
            :class="{ 'text-gray-400': !call.self.audio }"
          >
            <ui-icon name="mic" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="!call.self.audio"
            />
          </ui-button>
        </div>
        <div class="w-auto" v-if="call.connected && call.video">
          <ui-button
            title="Turn off your camera"
            class="relative"
            @click="toggleMedia('self', 'video')"
            color="none"
            :class="{ 'text-gray-400': !call.self.video }"
          >
            <ui-icon name="video" />
            <ui-icon
              name="close"
              class="absolute inset-0 h-full w-full p-1"
              size="none"
              v-if="!call.self.video"
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
      duration: 0,
    };
  },
  computed: {
    contact() {
      return this.$store.getters["contacts/contact"];
    },
    call() {
      return this.$store.getters["app/call"];
    },
    timer() {
      return this.call.connected
        ? $moment(this.call.connected)
            .utc()
            .add(this.duration, "seconds")
            .format("HH:mm:ss")
        : false;
    },
  },
  created() {
    this.setSettings();
  },
  mounted() {
    if (!this.call.connected) {
      this.prepare(this.call.video);
    } else {
      this.setStreams();
    }

    $socket.on("answer", (payload) => {
      this.call.RTC.setRemoteDescription(
        new RTCSessionDescription(payload.answer)
      ).catch((error) => this.$log("answer error", error));
    });

    $socket.on("candidate", (payload) => {
      this.call.RTC.addIceCandidate(
        new RTCIceCandidate(payload.candidate)
      ).catch((error) => this.$log("candidate error", error));
    });

    $socket.on("hang", () => {
      this.hang();
    });
    $socket.on("offer", (payload) => {
      this.call.RTC.setRemoteDescription(
        new RTCSessionDescription(payload.offer)
      )
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
      this.call.RTC.createAnswer()
        .then((answer) => {
          this.call.RTC.setLocalDescription(answer).then(() => {
            this.send("answer", { answer });

            this.callStarted();

            $play("ringtone", false, false);
          });
        })
        .catch((error) => {
          this.$log("answer has error", error);
        });
    },
    offer() {
      this.call.RTC.createOffer()
        .then((offer) => {
          this.call.RTC.setLocalDescription(offer).then(() => {
            this.send("offer", { offer });

            this.callStarted();

            $play("ringtone", false, false);
          });
        })
        .catch((error) => {
          this.$log("offer has error", error);
        });
    },
    hang() {
      $play("hang");

      if (this.call.connected) {
        this.setProp("connected", false);

        this.call.selfStream.getTracks().forEach((track) => {
          track.stop();
        });

        this.call.RTC.close();
      }

      this.setProp("RTC", false);

      this.$store.dispatch("app/setPanel", undefined).then(() => {
        this.$store.dispatch("app/setCall", {});
        $socket.removeAllListeners("hang");
      });

      this.send("hang");
    },
    prepare(video = false) {
      navigator.permissions
        .query({ name: "camera" })
        .then((result) => {
          if (result.state == "denied") {
            this.$store.dispatch("app/setAlert", {
              title: "Camera access required",
              body: `In order to start a video/audio call, you must allow this webpage access to your camera.`,
              time: new Date(),
              color: "red",
            });
          }
        })
        .then(() => {
          navigator.permissions.query({ name: "microphone" }).then((result) => {
            if (result.state == "denied") {
              this.$store.dispatch("app/setAlert", {
                title: "Microphone access required",
                body: `In order to start a video/audio call, you must allow this webpage access to your microphone.`,
                time: new Date(),
                color: "red",
              });
            }
          });
        });

      return navigator.mediaDevices
        .getUserMedia({
          video: video
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
        })
        .then((stream) => {
          this.setProp("selfStream", stream);

          this.setStreams();

          this.setProp(
            "RTC",
            new RTCPeerConnection(
              { iceServers: ICE_SERVERS },
              { optional: [{ DtlsSrtpKeyAgreement: true }] }
            )
          );

          this.call.RTC.ontrack = (event) => {
            this.setProp("partnerStream", event.streams[0]);

            this.setStreams();
          };

          this.call.selfStream
            .getTracks()
            .forEach((track) =>
              this.call.RTC.addTrack(track, this.call.selfStream)
            );

          this.call.RTC.onicecandidate = (event) => {
            if (event.candidate) {
              this.send("candidate", {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                candidate: event.candidate,
              });
            }
          };
        })
        .catch((error) => {
          this.$store.dispatch("app/setAlert", {
            title: "Camera and Microphone access required",
            body: `In order to start a video/audio call, you must allow this webpage access to your camera and microphone.`,
            time: new Date(),
            color: "red",
          });
          this.$log("Error at preparing. Trying without video", error);
        });
    },
    send(type, data) {
      data = { ...data, contact: this.call.with.id };
      $socket.emit(type, data);
    },
    setSilence() {
      $play("ringtone", false, false);

      this.setProp("silence", true);
    },
    toggleMedia(target, media) {
      this.$refs[target].srcObject.getTracks().forEach((t) => {
        if (t.kind === media) {
          t.enabled = !t.enabled;

          this.setProp(target, { ...this.call[target], [media]: t.enabled });
        }
      });
    },
    callStarted() {
      this.setProp("connected", 1);

      setInterval(() => {
        this.duration++;
      }, 1000);
    },
    setProp(key, value) {
      this.$store.dispatch("app/setCallProp", {
        key,
        value,
      });
    },
    setStreams() {
      this.$refs.self.srcObject = this.call.selfStream;

      this.$refs.partner.srcObject = this.call.partnerStream;
    },
    setSettings() {
      return new Promise((resolve) => {
        this.setProp("self", { audio: true, video: this.call.video });

        this.setProp("partner", { audio: true, video: this.call.video });

        resolve();
      });
    },
  },
};
</script>

