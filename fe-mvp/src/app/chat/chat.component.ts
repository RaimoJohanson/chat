import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FormBuilder } from '@angular/forms';

class ChatMessage {
  id?: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  id: string;
  messages: ChatMessage[] = [];
  form = this.fb.group({ message: '' });

  constructor(
    private fb: FormBuilder,
    private socket: Socket) {
    this.socket.on('message', (message: ChatMessage) => {
      console.log(message);
      this.addMessage(message);
    });
  }

  ngOnInit() {
    this.socket.on('connect', () => {
      this.id = this.socket.ioSocket.id;
      this.sendMessage('test message');
      this.sendMessage('test message');
      this.sendMessage('test message');
      this.sendMessage('test message');
      this.sendMessage('test message');
    });
  }

  submit() {
    const message = this.form.get('message').value;
    if (message) {
      this.sendMessage(message);
    }
  }

  sendMessage(message: string) {
    console.log(message);
    this.socket.emit('message', { content: message });
    this.form.reset();
  }

  addMessage(message: ChatMessage) {
    this.messages = [...this.messages, message];
  }

}
