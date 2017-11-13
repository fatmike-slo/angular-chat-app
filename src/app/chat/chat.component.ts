import { Component, OnInit } from "@angular/core";
import * as io from "socket.io-client";

import { ChatService } from "./shared/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})




export class ChatComponent implements OnInit {
  messages = new Array();
  username:any;
  userList:any[] = new Array();
  typingMessage:any = "";
  scrollText:any;
  chatInput:string = "";

  // @ViewChild("inputField") inputFieldRef: ElementRef;
  // interval: any = setInterval(()=> {
  //   this._chatService.emit("get-users", {});
  // }, 3000)

  constructor(private _chatService: ChatService) {}

  ngOnInit() {
    this.messages = new Array();

    this._chatService.on("onClientRecieve", (msg: any) => {
      this.messages.push(msg);
    });
    this._chatService.on("typing-message", (data)=> {
      this.typingMessage = data.message;
    });
    // in poglej vse userje ki so prijavljeni
    this._chatService.on("get-users", (data)=> {
      this.userList = data;
    }); 
    // refresh to display latest text if any  
    // window.setInterval(function() {
    //   var elem = document.getElementById('box');
    //   elem.scrollTop = elem.scrollHeight;
    // }, 3000);

    
    // get register users from db
    // this._dbService.getUser().subscribe((data)=> {
      //   this.userList = data;
      // });
    }
 
       
  send(msg:string):void {
    let getDate = new Date();
    const messageObj = {
      username:this.username,
      text:msg,
      date:getDate.toLocaleTimeString()
    }
    // emit input value, clreat typing broadcast and retrieve registered users
    this._chatService.emit("onClientEmit", messageObj);
    this._chatService.emit("typing-message", {message:""});
    this._chatService.emit("get-users", {});
    // allow to display last inputed text
    this.scrollText = window.setTimeout(function() {
      var elem = document.getElementById('box');
      elem.scrollTop = elem.scrollHeight;
    }, 100);
    // clear chat input field
    this.chatInput = "";
  }

  typeEvent():void {
    let typeMessage = {
      message: "User " + this.username + " is typing"
    }
    this._chatService.emit("typing-message", typeMessage);
  }
  getNewState($event:any):void {
    //fetch new user and push into userlist
    this.username = $event.username;
    this.userList.push($event.username)
  }
  handleLogOut():void {
    this._chatService.emit("logout", this.username);
    this.username = false;
  }
}

// ngOnInit() {

//   let socket = io.connect("http://127.0.0.1:3000");
//   socket.on("news", (data)=> {
//     console.log("from client--> ", data);
//     this.data = data;
//     socket.emit("my other event", {hello:"hello back from client"});
//   });
// }
