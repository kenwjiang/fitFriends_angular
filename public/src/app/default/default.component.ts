/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../user.service'
import { ChatService } from '../chat.service';
import { SocketsService } from '../sockets.service';

declare const google: any;

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  self: any;
  host_id: string;
  members: any=[];

  constructor(
    private _router:Router,
    private userService: UserService,
    private socketsService: SocketsService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.host_id = localStorage.getItem("id");
    this.defaultGymPage();
  }

  defaultGymPage(){
    this.userService.getSelf(localStorage.getItem('id'))
    .subscribe(data=>{
      this.self = data;
      this.userService.getGymMembers({self_id: this.self._id, gym_id:data['default_gym']})
      .subscribe(members=> {
        this.members = members;
        console.log(members);
      })
    })
  }


  createChat(guest_id){
    this.chatService.chatCheck({host_id: this.host_id, guest_id: guest_id})
    .subscribe((data: any)=> {
      if(data.length === 0){
        let chatroom_id = this.chatId();
        console.log("chatroom id", chatroom_id);
        this.socketsService.createChat({host_id: this.host_id, chatroom_id: chatroom_id, guest_id:guest_id});
        this._router.navigate(['/main/chat', chatroom_id]);
      }else {
        console.log("else data", data);
        let room_id = data[0]['chatroom_id'];
        this._router.navigate(['/main/chat/', room_id])
      }
    })
  }

  private chatId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
