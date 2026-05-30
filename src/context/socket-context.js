import { createContext } from "react";
import io from "socket.io-client";
import { WEB_SOCKET_URL } from "../config/endpoints";
// import { decryptString } from "../utils/crypto";
export const socket = io(WEB_SOCKET_URL, {
  autoConnect: false,
  // auth: {
  //   token: decryptString(localStorage.getItem("authToken"))
  // }
});
export const SocketContext = createContext(socket);
