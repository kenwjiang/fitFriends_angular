import { Component, OnInit, OnDestroy } from '@angular/core';
import {SocketsService} from '../sockets.service'
import { ChatService } from 'src/app/chat.service';
import {  Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, NavigationEnd, Event } from '@angular/router';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, OnDestroy {
  room_id:string;
  roomData:any;
  msgToSend: string;
  roomMsgs:any=[];
  private _chatMsgs: Subscription

  constructor(
      private chatService: ChatService,
      private socketsService: SocketsService,
      private _router: Router,
      private _route: ActivatedRoute,
  ) { }
  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.room_id = (params['room_id']);
    });
    this._router.events.subscribe(
        (event: Event) => {
            if (event instanceof NavigationEnd) {
              this.currentRoom();
            }
   });
   this._chatMsgs = this.socketsService.allMessages.subscribe(data => {
     this.roomMsgs = data['msg'];
     this.currentRoom();
   });

    this.currentRoom();
  }
  ngOnDestroy(){
    this._chatMsgs.unsubscribe();
  }

  currentRoom(){
    this.chatService.getChatroom(this.room_id)
    .subscribe(data => {
      this.roomData = data;
      this.roomMsgs = data['msg'];
    })
    this.socketsService.setChatroom(this.room_id);
  }
  sendMsg(){
    this.socketsService.postMsg({chatroom_id: this.room_id, msg:this.msgToSend, sender_id: localStorage.getItem('id')});
    this.msgToSend='';
  }
}
