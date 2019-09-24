import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-set-schedule',
  templateUrl: './set-schedule.component.html',
  styleUrls: ['./set-schedule.component.css']
})
export class SetScheduleComponent implements OnInit {
  private schedule: any;
  private self: any;

  constructor(
    private _userServ: UserService
  ) { }

  ngOnInit() {
    this.getSchedule();
    this.schedule= {
      mon: '',
      tues: '',
      wed: '',
      thurs: '',
      fri: '',
      sat: '',
      sun: '',
    }
  }
  private getSchedule(){
    this._userServ.getSelf(localStorage.getItem('id')).subscribe(data=>{
      this.schedule = data['schedule'];
      console.log('data', data);
    })
  }
}
