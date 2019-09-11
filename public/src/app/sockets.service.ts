import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class SocketsService implements OnInit, OnDestroy {
  allMessages = this.socket.fromEvent<any[]>('posted');
  chatrooms = this.socket.fromEvent<string[]>("refreshChat");
  constructor(
    private socket: Socket
  ) { }
  ngOnInit(){

  }
  ngOnDestroy(){
  }


  postMsg(data){
    this.socket.emit('postMsg', data);
  }
  setChatroom(id){
    this.socket.emit('setChatroom', id)
  }
  createChat(data){
    this.socket.emit('createChat', data);
  }
  getAllChats(id: string){
    console.log("here at get all chats");
    this.socket.emit('getAllChats', id)
  }
}
