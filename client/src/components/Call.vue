<template>
  <div class="bg-gray-600 p-5">
    <div class="container space-y-4" v-if="onCall">
      <div class="flex w-full max-h-96">
        <div v-if="onCall" class="space-y-4 w-full">
          <div class="flex justify-center items-center">
            <div
              class="
                p-4
                bg-gradient-to-b
                from-blue-50
                via-blue-300
                to-blue-200
                rounded-full
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
            <span class="text-sm">Video calling...</span>
          </span>
          <div class="flex justify-end space-x-4" v-if="onCall">
            <div class="w-auto">
              <ui-button
                @click="answer"
                class="animate-pulse"
                v-if="onCall === contact.id && !connected"
              >
                <ui-icon name="call" />
              </ui-button>
            </div>
            <div class="w-auto">
              <ui-button @click="hang" color="red">
                <ui-icon name="call" class="transform rotate-180" />
              </ui-button>
            </div>
          </div>
        </div>
        <!-- VIDEO -->
        <div class="p-2 w-full">
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
    </div>
    <div v-else class="flex justify-end space-x-4">
      <div class="w-auto">
        <ui-button @click="videoCall">
          <ui-icon name="video" />
        </ui-button>
      </div>
      <div class="w-auto">
        <ui-button @click="hang" color="blue">
          <ui-icon name="call" />
        </ui-button>
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
      onCall: false,
      pc: undefined,
      playing: undefined,
      connected: false,
      dataBag: undefined,
    };
  },
  computed: {
    contact() {
      return this.$store.getters["contacts/contact"];
    },
  },
  mounted() {
    $socket.on("offer", (payload) => {
      $play("ringtone", true);

      this.onCall = this.contact.id;

      this.dataBag = payload;
    });

    $socket.on("candidate", (payload) => {
      this.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    });

    $socket.on("answer", (payload) => {
      this.pc.setRemoteDescription(new RTCSessionDescription(payload.answer));

      $play("ringtone", false, false);

      this.connected = true;

      this.onCall = true;
    });

    $socket.on("hang", () => {
      this.handleHang();
    });
  },
  methods: {
    audioCall() {},
    answer() {
      this.prepare().then(() => {
        this.pc.setRemoteDescription(
          new RTCSessionDescription(this.dataBag.offer)
        );

        this.pc
          .createAnswer()
          .then((answer) => {
            this.pc.setLocalDescription(answer);

            this.send("answer", { answer });

            this.connected = true;

            $play("ringtone", false, false);
          })
          .catch((error) => {
            this.$log(error);
          });
      });
    },
    createPeerOffer() {
      this.pc
        .createOffer()
        .then((offer) => {
          this.send("offer", { offer });

          this.pc.setLocalDescription(offer);

          $play("ringtone");
        })
        .catch((error) => {
          this.$log(error);
        });
    },
    handleHang() {
      if (this.connected) {
        this.$refs.partner.srcObject = undefined;
        this.$refs.self.srcObject = undefined;

        this.pc.close();

        this.pc = undefined;
      }

      $play("ringtone", false, false);

      this.onCall = false;
      this.connected = false;
    },
    hang() {
      this.send("hang");
      this.handleHang();
    },
    prepare() {
      return navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.$refs.self.srcObject = stream;

          this.pc = new RTCPeerConnection(config);

          stream
            .getTracks()
            .forEach((track) => this.pc.addTrack(track, stream));

          this.pc.ontrack = (event) => {
            console.log(event);
            // Don't set srcObject again if it is already set.
            if (this.$refs.partner.srcObject) return;
            this.$refs.partner.srcObject = event.streams[0];
          };

          this.pc.onicecandidate = (event) => {
            if (event.candidate) {
              this.send("candidate", {
                candidate: event.candidate,
              });
            }
          };
        })
        .catch((error) => {
          this.$log(error);
        });
    },
    send(type, data) {
      data = { ...data, contact: this.contact.id };
      $socket.emit(type, data);
    },
    videoCall() {
      this.onCall = true;
      this.prepare().then(() => {
        this.createPeerOffer();
      });
    },
  },
};
</script>
