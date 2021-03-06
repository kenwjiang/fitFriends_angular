import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SocketsService } from 'src/app/sockets.service';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  self_id: string;
  mobileQuery: MediaQueryList;
  allRooms: Observable<any[]>;
  private _rooms: Subscription;
  private _mobileQueryListener: ()=> void;

  constructor(
    private socketsService: SocketsService,
    private router: Router,
    public route: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 411px)");
    this._mobileQueryListener=()=>changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

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

  setRead(data) {
    this.socketsService.setRead(data)
  }


  private checkUnreadChats(array){
    for(let i = 0; i < array.length; i ++) {
      if(array[i]['msg']){
        let msg = array[i]['msg'];
        for(let j = msg.length - 1; j >= 0; j--){
          if(msg[j]['sender']['_id'] != this.self_id && msg[j]['read'] == false) {
            array[i]['read'] = false;
            break;
          } else if (msg[j]['sender']['_id'] != this.self_id && msg[j]['read'] == true){
            array[i]['read'] = true;
            break;
          } else {
            continue;
          }
        }
        if(array[i]['read'] == null){
          array[i]['read'] = true;
        }
      }
    }
    return array;
  }
  
}
