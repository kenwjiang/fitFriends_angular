import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {SocketsService} from '../sockets.service'
import {  Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Params, Router, NavigationEnd, Event } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, OnDestroy {
  @ViewChild('box', {static:false})
   private box: any ;
   

  room_id:string;
  msgToSend: string;
  data: any;
  self: any;
  other_person: any;
  self_id: string;
  roomData:Observable<any[]>;
  private _room: Subscription;

  constructor(
      private socketsService: SocketsService,
      private userService: UserService,
      private _router: Router,
      private _route: ActivatedRoute,
  ) { }
  ngOnInit() {
    this.self_id = localStorage.getItem('id');
    this._route.params.subscribe((params: Params) => {
      this.room_id = (params['room_id']);
      this.currentRoom(this.room_id);
    });
    this._router.events.subscribe(
        (event: Event) => {
            if (event instanceof NavigationEnd) {
              this.currentRoom(this.room_id);
              setTimeout(()=> this.box.nativeElement.scrollTop = this.box.nativeElement.scrollHeight, 300 )
            }
   });
   this._room = this.socketsService.currentRoom.subscribe(data=> {
     this.checkSender(data);
     data['msg'] = this.setMsgRead(data['msg']);
     this.roomData = data['msg'];
     this.setRead(data);
   })
   this.userService.getSelf(this.self_id).subscribe(data=> {
     this.self = data;
   })
  }
  ngAfterViewInit(){
    setTimeout(()=> this.box.nativeElement.scrollTop = this.box.nativeElement.scrollHeight, 300 )

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

  private checkSender(data) {
    if(data['host']['_id'] == this.self_id){
      this.other_person = data['guest'];
    } else {
      this.other_person = data['host'];
    }
  }
  
  private getAge (date: any){
    let today: any = new Date();
    let bday: any  = new Date(date);
    return Math.floor((today - bday) / (1000*60*60*24*365))
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
