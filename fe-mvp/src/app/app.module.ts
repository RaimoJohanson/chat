import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

const url = environment.apiURL;
const config: SocketIoConfig = { url, options: { resource: 'chat-api/socket.io' } };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
