import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketsService } from 'src/app/sockets.service';
import { Observable, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  self_id: string;
  allRooms: Observable<string[]>;
  private _rooms: Subscription;

  constructor(
    private socketsService: SocketsService,
    private socket: Socket
  ) { }

  ngOnInit() {
    this.self_id = localStorage.getItem('id');
    this.socket.on('allChatrooms', (data)=> {
      this.allRooms = data;
    });

    this._rooms = this.socketsService.chatrooms.subscribe(data => {
      this.socketsAllChats();
    })
    this.socketsAllChats();

  }
  ngOnDestroy(){}

  socketsAllChats(){
    this.socketsService.getAllChats(this.self_id);
  }


}
