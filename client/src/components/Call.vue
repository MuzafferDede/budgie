<template>
  <div class="bg-gray-600 p-5">
    <div ref="container" class="container space-y-4" v-if="onCall">
      <div class="flex w-full max-h-96" v-show="connected">
        <div class="p-2 w-full">
          <video
            class="w-full h-full object-cover rounded-lg"
            ref="partner"
            @loadedmetadata="$event.target.play()"
          />
        </div>
        <div class="p-2 w-full">
          <video
            class="w-full h-full object-cover rounded-lg"
            ref="self"
            @loadedmetadata="$event.target.play()"
          />
        </div>
      </div>
    </div>
    <div v-if="onCall" class="space-y-4">
      <div class="flex justify-center items-center">
        <div
          class="
            animate-bounce
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
            v-if="onCall === contact.id"
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

const configiratinos = {
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
      peer: undefined,
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
    $socket.on("handle calling", (data) => {
      console.log(data);
    });

    $socket.on("handle candidate", (data) => {
      this.handleCandidate(data.candidate);
    });

    $socket.on("handle offer", (data) => {
      $play("ringtone", true);

      this.onCall = this.contact.id;

      this.dataBag = data;
    });

    $socket.on("handle answer", (data) => {
      this.handleAnswer(data.answer);
    });

    $socket.on("handle hang", () => {
      this.handleHang();
    });
  },
  methods: {
    videoCall() {
      this.onCall = true;

      this.prepare().then(() => {
        this.peer.onaddstream = (event) => {
          this.$refs.partner.srcObject = event.stream;
        };

        this.peer.onicecandidate = (event) => {
          if (event.candidate) {
            this.send("offer", {
              candidate: event.candidate,
            });
          }
        };

        this.createPeerOffer();
      });
    },
    audioCall() {},
    answer() {
      this.prepare().then(() => {
        this.handleOffer(this.dataBag.candidate);
      });
    },
    prepare() {
      return navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.$refs.self.srcObject = stream;

          this.peer = new RTCPeerConnection(configiratinos);

          this.peer.addStream(stream);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createPeerOffer() {
      this.peer
        .createOffer()
        .then((offer) => {
          this.send("offer", { offer });

          this.peer.setLocalDescription(offer);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleOffer(offer) {
      this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      this.peer
        .createAnswer()
        .then((answer) => {
          this.peer.setLocalDescription(answer);

          this.send("answer", { answer });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleAnswer(answer) {
      this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    },
    handleCandidate(candidate) {
      this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    },
    handleHang() {
      if (this.connected) {
        this.$refs.partner.srcObject = undefined;
        this.$refs.self.srcObject = undefined;

        this.peer.close();

        this.peer = undefined;
      }

      $play("ringtone", false, false);

      this.onCall = false;
    },
    hang() {
      this.send("hang");
      this.handleHang();
    },
    send(type, data) {
      data = { ...data, contact: this.contact.id };
      $socket.emit(type, data);
    },
  },
};
</script>
