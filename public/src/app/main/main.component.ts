import { ChangeDetectorRef, Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {  Router } from '@angular/router';
import { UserService } from '../user.service'
import { AuthService } from '../auth.service'
import { SocketsService } from '../sockets.service'
import { Subscription, Observable } from 'rxjs';

declare const $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnChanges, OnDestroy {
  self_id: string;
  self: any;
  mobileQuery: MediaQueryList;
  private unread: boolean;
  private chatrooms: Observable<any[]>;
  private _sub : Subscription;

  private _mobileQueryListener: ()=> void;


  constructor(
    private _router: Router,
    private _userService: UserService,
    private _authService:AuthService,
    private socketsService: SocketsService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) { 
    this.mobileQuery = media.matchMedia("(max-width: 768px)");
    this._mobileQueryListener=()=>changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit() {
    this.self_id = localStorage.getItem('id');
    this.checkPref();
    this.self = {fname:"", lname: ""};
    this.subscribeChats(this.self_id);
    this._sub = this.socketsService.chatrooms.subscribe(data => {
      console.log('chatroom data', data);
      this.chatrooms = data;
      this.unread = this.checkUnread(this.chatrooms);
    })
  }

  ngOnChanges(){
    // this.unread = this.checkUnread(this.chatrooms);
  }
  
  ngOnDestroy():void{
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this._sub.unsubscribe();
  }

  checkPref(){
    this._userService.getSelf(this.self_id)
    .subscribe( data=> {
      console.log('self', data);
      this.self = data;
      localStorage.setItem('gym', this.self.default_gym);
      if(!data['preference'] || !data['schedule']){
        this._router.navigate(['/main', 'preferences'])
      }
    })
  }
  // checkMsgs(){
  //   this.socketsService.checkUnread({chatroom_id: })

  // }

  subscribeChats(id){
    this.socketsService.getAllChats(id);
  }

  logout(){
    this._authService.logout();
    this._router.navigate(['/login'])
  }


  private checkUnread(array){
    for(let i = 0; i< array.length; i++){
      if(array[i]['msg']){
        for( let j = array[i]['msg'].length-1; j >= 0; j--) {
          if(array[i]['msg'][j]['sender']['_id'] != this.self_id && array[i]['msg'][j]['read'] == false) {
            return true;
          } else if (array[i]['msg'][j]['sender']['_id'] != this.self_id && array[i]['msg'][j]['read'] == true){
            return false;
          } else {
            continue;
          }
        }
      }
    }
    return false;
  }


}
