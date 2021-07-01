import moment from "moment";
import { io } from "socket.io-client";

const audio = {
    notify: new Audio("notify.mp3"),
    error: new Audio("error.mp3"),
    typing: new Audio("typing.mp3"),
};

export const $socket = io("http://localhost:8080", {
    autoConnect: false,
});

export function $time(time) {
    return time ? moment(time).fromNow() : undefined;
}

export function $play(type) {
    audio[type].currentTime = 0;

    audio[type].play();
}

export function $copy(element) {
    element.target.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    return true;
}

export function $alert(message) {
    alert(message)
}

