import moment from "moment";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

const audio = {
    error: new Audio("error.mp3"),
    hang: new Audio("hang.mp3"),
    notify: new Audio("notify.mp3"),
    message: new Audio("message.mp3"),
    ringtone: new Audio("ringtone.mp3"),
    typing: new Audio("typing.mp3"),
};

let currentAudio;

const APP_URL = (() => {
    const protocol = "http" + (location.hostname == "localhost" ? "" : "s") + "://";
    return protocol + location.hostname + (location.hostname == "localhost" ? ":8080" : "");
})();

export const $socket = io(APP_URL, {
    autoConnect: false,
});

export function $time(time) {
    return time ? moment(time).fromNow() : undefined;
}

export const $moment = moment;


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


export function $notify(notification) {
    if (Notification.permission !== 'denied') Notification.requestPermission();

    if (document.visibilityState === 'visible') return;

    if (Notification.permission === 'granted') new Notification(notification.title, { body: notification.body, icon: '/logo.png' })
}