
import { Injectable, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnInit {
  currentChat = this.socket.fromEvent<Document>('currentChat');
  chatrooms = this.socket.fromEvent<any[]>('allChatrooms');

  constructor(private socket: Socket,
              private http: HttpClient) { }
  ngOnInit(){
  }

  newChat(data) {
    return this.http.post('/createChat', data);
  }

  getChatroom(room_id: string){
    return this.http.get('/getRoom/'+room_id);
  }

  postMsg(data){
    return this.http.post('/postMsg', data);
  }
  chatCheck(data){
    return this.http.post('/checkChat', data);
  }

}
