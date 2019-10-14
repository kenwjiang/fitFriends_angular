import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketsService implements OnInit, OnDestroy {
  chatrooms = this.socket.fromEvent<Observable<any[]>>("allChatrooms");
  currentRoom = this.socket.fromEvent<Observable<any>>('currentChat');
  

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

  createChat(data){
    this.socket.emit('createChat', data);
  }
  getChatroom(room_id){
    this.socket.emit('getChatroom', room_id)
  }
  getAllChats(id: string){
    this.socket.emit('getAllChats', id)
  }
  setRead(data) {
    this.socket.emit('setRead', data);
  }
  checkUnread(data){
    this.socket.emit('checkUnread', data);
  }
}
