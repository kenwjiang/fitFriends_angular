/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { MapsAPILoader } from '@agm/core';
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
  service: any;
  gym: any;
  hoverIndex: number;
  goalsDiv: boolean;
  scheduleDiv: boolean;


  constructor(
    private _router:Router,
    private userService: UserService,
    private socketsService: SocketsService,
    private chatService: ChatService,
    private mapsAPILoader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.host_id = localStorage.getItem("id");
    this.gym={name: '', formatted_address:''};
    this.hoverIndex = -1;
    this.goalsDiv = false;
    this.scheduleDiv = false;
    this.defaultGymPage();

    // init google api
    this.mapsAPILoader.load().then(() => {
     var map = new google.maps.Map(document.getElementById('map'));

      // getDetails query, find gym info and set to gym variable
      this.service = new google.maps.places.PlacesService(map);
      let request = {
        placeId: `${localStorage.getItem('gym')}`,
        fields: ["formatted_address", 'name' ]
      }
      this.service.getDetails(request, (res, status)=>{
        this.gym = res;
      });
    });
  }


  // get self data, get other users who set this as a default gym.
  defaultGymPage(){
    this.userService.getSelf(localStorage.getItem('id'))
    .subscribe(data=>{
      this.self = data;
      this.userService.getGymMembers({self_id: this.self._id, gym_id:data['default_gym']})
      .subscribe(members=> {
        this.members = members;
        this.matchingMembers();
      })
    })
  }

  //create chat, takes in other user's Id, check to see if there's a chatroom between the two users already existing. If not, create new chatroom, id randomly generated
  createChat(guest_id){
    this.chatService.chatCheck({host_id: this.host_id, guest_id: guest_id})
    .subscribe((data: any)=> {
      if(data.length === 0){
        let chatroom_id = this.chatId();
        this.socketsService.createChat({host_id: this.host_id, chatroom_id: chatroom_id, guest_id:guest_id})
        setTimeout(()=>this._router.navigate(['/main/chat', chatroom_id]), 200); 
      }else {
        let room_id = data[0]['chatroom_id'];
        this._router.navigate(['/main/chat/', room_id])
      }
    })
  }


  private matchingMembers(){
    let a = this.members;
    let temp = [];

      // if preference for any key is true, then push into temp array to check later
    for(let key in this.self['preference']){
      if(this.self['preference'][key] == true){
        temp.push(key)
      }
    }

    //loop through members, set counter  && check each member's preference with logged in user's preferences
    for(let i = 0; i < this.members.length; i++){
      let counter = 0;
        for(let j = 0; j < temp.length; j++){
          let idx = temp[j];
          if(this.members[i]['preference'][idx] === true){
            counter++;
          }
        }
        this.members[i]['ranking'] = counter;
    }

    //sort by highest match count to lowest
    this.members = this.members.sort((a, b)=> (a['ranking'] > b['ranking']) ? -1: 1);

    // filter members by match count, gender of both parties, and gender preference of both parties.
    this.members = this.members.filter(el => ((el['ranking'] > 0) && (this.self['gender'] == el['preference']['gender']) && (this.self['preference']['gender'] == el['gender'])));
      
  }

  private hover(i, div){
    this.hoverIndex = i;
    if(div == 'goals') {
      this.goalsDiv = true;
    } else if (div == 'schedule'){
      this.scheduleDiv = true;
    } else {
      this.goalsDiv = false;
      this.scheduleDiv = false;
    }
  }

  
  private getAge (date: any){
    let today: any = new Date();
    let bday: any  = new Date(date);
    return Math.floor((today - bday) / (1000*60*60*24*365))
  }

  //randomly generate chatroom id for socket chat
  private chatId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
