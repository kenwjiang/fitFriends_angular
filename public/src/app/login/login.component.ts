import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { FlashMessagesService } from 'ngx-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;

  constructor(
      private userService: UserService,
      private _auth: AuthService,
      private flashMessagesService: FlashMessagesService,
      private _router: Router
  ) { }

  ngOnInit() {
  }

  loginUser(){
      this._auth.loginUser({username: this.username, password: this.password})
      .subscribe(
          res=> {
              this.userService.getSelf(res.user._id);
              localStorage.setItem('gym', res['user']['default_gym']);
              localStorage.setItem('token', res['token']);
              localStorage.setItem('id', res['user']['_id']);
              this._router.navigate(['/main', 'default']);
          },
          err=> {
            this.flashMessagesService.show("Invalid Credentials. Try again", {
              classes: ["alert-danger"]
            })
            this._router.navigate(['/login']);
          }
      )
  }

}
