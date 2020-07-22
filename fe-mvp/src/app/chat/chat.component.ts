import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FormBuilder } from '@angular/forms';
import * as faceapi from '../../face-api.min.js';
import { keyframes } from '@angular/animations';
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
  otherSideExpression = 'neutral';
  form = this.fb.group({ message: '' });
  @ViewChild('webcamFeed', { static: true }) webcam: ElementRef;

  constructor(
    private fb: FormBuilder,
    private socket: Socket) {
    this.socket.on('message', (message: ChatMessage) => {
      console.log(message);
      this.addMessage(message);
    });

    this.socket.on('expression', (expression: ChatMessage) => {
      if (expression.id !== this.id) {
        this.otherSideExpression = expression.content;
      }
    });
  }

  ngOnInit() {
    this.loadModels();
    this.startVideo(this.webcam);
    this.socket.on('connect', () => {
      this.id = this.socket.ioSocket.id;
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

  sendExpression(expression) {
    this.socket.emit('expression', { content: expression });
  }

  addMessage(message: ChatMessage) {
    this.messages = [...this.messages, message];
  }

  startVideo(video) {
    navigator.getUserMedia(
    {  video: {} },
      stream => video.nativeElement.srcObject = stream,
      error => console.error(error)
    );
  }

  handleVideoPlay(event) {
    setInterval(async () => {
      const detections: any[] = await faceapi
        .detectAllFaces(this.webcam.nativeElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      if (detections && detections.length) {
        const values: number[] = Object.values(detections[0].expressions);
        const highest = Math.max(...values);
        const expression = Object.keys(detections[0].expressions)
          .find(key => detections[0].expressions[key] === highest);
        console.log(expression);
        this.sendExpression(expression);
      }
    }, 500);
  }

  loadModels() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]);
  }
}
