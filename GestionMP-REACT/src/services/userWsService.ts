// services/userWsService.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { User } from "./UserService";

let stompClient: Client | null = null;

export const connectUserWs = (onUpdate: (users: User[]) => void) => {
  const socketFactory = () => new SockJS("http://localhost:8080/ws");
  
  stompClient = new Client({
    webSocketFactory: socketFactory,
    reconnectDelay: 5000,
    debug: (msg) => console.log(msg),
  });

  stompClient.onConnect = () => {
    stompClient?.subscribe("/topic/activeUsers", (message) => {
      const users: User[] = JSON.parse(message.body);
      onUpdate(users);
    });
  };

  stompClient.onStompError = (frame) => {
    //console.error("Broker error:", frame.headers["message"], frame.body);
  };

  stompClient.activate();
};

export const disconnectUserWs = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }
};
