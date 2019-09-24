import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {  Router } from '@angular/router';
import { UserService } from '../user.service'
import { AuthService } from '../auth.service'

declare const $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  self_id: string;
  self: any;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: ()=> void;


  constructor(
    private _router: Router,
    private _userService: UserService,
    private _authService:AuthService,
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
  }
  ngOnDestroy():void{
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  checkPref(){
    this._userService.getSelf(this.self_id)
    .subscribe( data=> {
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
