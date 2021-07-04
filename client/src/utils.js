import moment from "moment";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

const audio = {
    notify: new Audio("notify.mp3"),
    message: new Audio("message.mp3"),
    error: new Audio("error.mp3"),
    ringtone: new Audio("ringtone.mp3"),
    typing: new Audio("typing.mp3"),
};

let currentAudio;

export const $socket = io("http://localhost:8080", {
    autoConnect: false,
});

export function $time(time) {
    return time ? moment(time).fromNow() : undefined;
}

export function $play(type, loop = false, play = true) {

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = audio[type];

    currentAudio.currentTime = 0;
    currentAudio.loop = loop;

    if (!play) {
        return;
    }

    currentAudio.play();
}

export function $copy(element) {
    element.target.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    return true;
}

export function $alert(message) {
    alert(message);
}

export function $uuid() {
    return uuid();
}

