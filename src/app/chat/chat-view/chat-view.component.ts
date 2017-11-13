import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from "@angular/forms";

import {Observable} from 'rxjs/Observable'
import { ChatService } from "./../shared/chat.service";


@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent implements OnInit {
  messages:any[] = new Array();
  typingMessage:any;
  username:any;
  userList:any[] = new Array();

  interval: any = setInterval(()=> {
    this._chatService.emit("get-users", {});
  }, 3000);
  message:string;


  scrollText:any = setInterval(function() {
    console.log("scrolling text");
      var elem = document.getElementById('box');
      elem.scrollTop = elem.scrollHeight;
    }, 15000);


  @Output()
  stateChangeEvent:EventEmitter<any> = new EventEmitter<any>();

  constructor(private _chatService:ChatService) { }

  ngOnInit() {
    //get text view data
    this._chatService.on("onClientRecieve", (msg:any)=> {
      this.messages.push(msg);
    });
    // display if another using is typing
    this._chatService.on("typing-message", (data)=> {
      this.typingMessage = data.message;
    });    
    // in poglej vse userje ki so prijavljeni
    this._chatService.on("get-users", (data)=> {
      console.log("dobimo", data);
      this.userList = data;
    });   
  }
  handleRegister(username:any):void {
    this.username = username;
    // prijavi novega userja
    this._chatService.emit("create-user", this.username);
    this._chatService.on("create-user", (data)=> {
      if(typeof data === "string") {
        console.log("tle na errorju", data);
        this.message = data;
        this.username = null;
      }
      else {
        // custom emit data to parent component
        this.stateChangeEvent.emit(this.username);
      }
    })
    this._chatService.emit("get-users", {});
    // in poglej vse userje ki so prijavljeni
    this._chatService.on("get-users", (data)=> {
      this.userList = data;
    });   
  }


 }
