import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

@Injectable()
export class ChatService {
  socket: SocketIOClient.Socket;

  constructor() {
    console.log("allloha");
    this.socket = io.connect("http://127.0.0.1:3000");
  }

  on(eventName: any, callback: any): any {
    if (this.socket) {
      this.socket.on(eventName, (data: any) => {
        callback(data);
      });
    }
  }
  emit(eventName: any, data:any): any {
    this.socket.emit(eventName, data);
  }
  removeListener(eventName:any) {
    this.socket.removeListener(eventName);
  }
}
