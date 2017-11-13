import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';

import { FormsModule  } from "@angular/forms";
import { HttpModule  } from "@angular/http";
import { ChatService } from "./chat/shared/chat.service";


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
