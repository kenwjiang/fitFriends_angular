import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { SocketsService } from 'src/app/sockets.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  self_id: string;
  allRooms: Observable<any[]>;
  private _rooms: Subscription;
  
  constructor(
    private socketsService: SocketsService
  ) { }

  ngOnInit() {
    this.self_id = localStorage.getItem('id');
    this._rooms = this.socketsService.chatrooms.subscribe(data => {
       this.allRooms = this.checkUnreadChats(data);
    })
    this.socketsAllChats();
  }
  ngOnDestroy(){
    this._rooms.unsubscribe();
  }

  socketsAllChats(){
    this.socketsService.getAllChats(this.self_id);
  }

  private checkUnreadChats(array) {
    for(let i = 0; i < array.length; i ++) {
      for(let j = array[i]['msg'].length-1; j >=0; j --) {
        if( array[i]['msg'][j]['read'] == false) {
          array[i]['unread'] = true;
          return array;
        } else {
          break
        }
      }
    }
    return array;
  }
  
}
