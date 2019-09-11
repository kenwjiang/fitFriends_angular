import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import {  Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    newUser: any;

    constructor(
        private _auth: AuthService,

        private _router: Router
        ){}

  ngOnInit() {
     this.newUser={username: '', password: '', fname:'', lname:'', email:'', dob: '', gender: ''};
  }

  addUser(){
      let observable = this._auth.registerUser(this.newUser);
      observable.subscribe(data => {
          localStorage.setItem("token", data.token);
          localStorage.setItem('id', data.id);
          this._router.navigate(['/main', 'default']);
      });

  }
}
