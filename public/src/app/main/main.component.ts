import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { UserService } from '../user.service'
import { AuthService } from '../auth.service'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  self_id: string;
  self: any;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _authService:AuthService
  ) { }

  ngOnInit() {
    this.self_id = localStorage.getItem('id');
    this.checkPref();
  }

  checkPref(){
    this._userService.getSelf(this.self_id)
    .subscribe( data=> {
      console.log("check pref data", data);
      this.self = data;
      localStorage.setItem('gym', this.self.default_gym);
      if(!data['preference'] || !data['schedule']){
        console.log('preferences has not yet been set');
        this._router.navigate(['/main', 'preferences'])
      }
    })
  }
  logout(){
    this._authService.logout();
    this._router.navigate(['/login'])
  }

}
