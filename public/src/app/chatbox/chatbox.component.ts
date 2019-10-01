import { Component, OnInit, OnDestroy} from '@angular/core';
import {SocketsService} from '../sockets.service'
import {  Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Params, Router, NavigationEnd, Event } from '@angular/router';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, OnDestroy {
  room_id:string;
  msgToSend: string;
  self_id: string;
  roomData:Observable<any[]>;
  private _room: Subscription;



  
  constructor(
      private socketsService: SocketsService,
      private _router: Router,
      private _route: ActivatedRoute,
  ) { }
  ngOnInit() {
    this.self_id = localStorage.getItem('id');

    this._route.params.subscribe((params: Params) => {
      this.room_id = (params['room_id']);
    });
    this._router.events.subscribe(
        (event: Event) => {
            if (event instanceof NavigationEnd) {
              this.currentRoom(this.room_id);
            }
   });
   this._room = this.socketsService.currentRoom.subscribe(data=> {
     data['msg'] = this.setMsgRead(data['msg']);
     this.roomData = data['msg'];
     this.setRead(data);
   })

    this.currentRoom(this.room_id);
  }
  ngOnDestroy(){
    this._room.unsubscribe();
  }


  currentRoom(id){
    this.socketsService.getChatroom(id);
  }


  sendMsg(){
    this.socketsService.postMsg({chatroom_id: this.room_id, msg:this.msgToSend, sender_id: localStorage.getItem('id')});
    this.msgToSend='';
  }
  setRead(data) {
    data['self_id'] = this.self_id;
    this.socketsService.setRead(data);
  }

  private setMsgRead(array){
    if(array) {
      let i = array.length -1;
      while (i >= 0){
        if(array[i]['sender']['_id'] != this.self_id && array[i]['read'] == false ){
          array[i]['read'] = true;
          i--;
        } else if (array[i]['sender']['_id'] != this.self_id && array[i]['read'] == true) {
          return array;
        } else {
          i--;
        }
      }
      return array;
    }
  }
}
