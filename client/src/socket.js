import { io } from "socket.io-client";

console.log('prepairing')
export default io("http://localhost:8080", {
    autoConnect: false,
});