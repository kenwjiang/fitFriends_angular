import { Injectable } from '@angular/core';
import { Http ,HttpModule} from '@angular/http' 
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  constructor(private _http: HttpClient) { }

  getSelf(id){
    return this._http.get('/getSelf/'+id)
  }
  getGymMembers(data){
    return this._http.post('/getGymMembers', data);
  }
  updateInfo(data){
    return this._http.post('/updateInfo', data);
  }
  updatePassword(data){
    return this._http.post('/updatePassword', data);
  }
  setAvatar(data){
    return this._http.post('/setAvatar', data);
  }
}
