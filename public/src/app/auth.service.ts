import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  registerUser(user){
    return this._http.post<any>('/registerUser', user);
  }
  loginUser(user){

      return this._http.post<any>('/loginUser', user);
  }
  loggedIn(){
      return !!localStorage.getItem('token');
  }
  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('id');
    localStorage.removeItem('gym');
  }

  getToken(){
      return localStorage.getItem('token');
  }

}
