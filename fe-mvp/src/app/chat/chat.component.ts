import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FormBuilder } from '@angular/forms';
import * as faceapi from '../../face-api.min.js';

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
      { video: {} },
      stream => video.nativeElement.srcObject = stream,
      error => console.error(error)
    );
  }

  handleVideoPlay(event) {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(this.webcam.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections && detections.length) {
        const maxScoreExpression = Object.entries(detections[0].expressions).sort((a, b) => b[1] - a[1])[0][0];

        this.sendExpression(maxScoreExpression);
      }
    }, 1000);
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
