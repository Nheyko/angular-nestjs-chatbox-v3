import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from './IMessage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket = io("http://localhost:8091");

  constructor(
    private readonly http: HttpClient,
  ) {
    this.socket.on("connect", () => {
      console.log("Connected.")
    })
  }

  async onConnectUser(username: string, isConnecting: boolean) {
    const data = {
      username: username,
      isConnecting: isConnecting
    }
    this.socket.emit('onUserConnect', data)
  }

  getConnectedList(): Observable<string[]> {
    return new Observable<string[]>(observer => {
      this.socket.on("connectResponse", (connectedList: string[]) => {
        observer.next(connectedList);
      });
    });
  }

  async sendMessage(data: any) {
    this.http.post('http://localhost:3000/messages', data, {withCredentials: true}).subscribe({
      next: () => {
        this.socket.emit('sendMessage', data);
      },
      error: (error) => {
        console.error("HTTP Post error:", error);
        throw error;
      }
    });
  }

  getNewMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on("newMessage", (data: Message) => {
        observer.next(data);
      });
    });
  }

  getLastMessages(): Observable<Message[]> {
    return this.http.get<Message[]>('http://localhost:3000/messages/latest/25', {withCredentials: true}).pipe(
      map(messages => messages.map(message => ({
        user_id: message.users[0].id,
        username: message.username,
        content: message.content,
        destinator: message.destinator
      }))),
    );
  }
}
