import { Component, OnInit } from '@angular/core';
import { PrefService } from '../pref.service';
import { UserService } from '../user.service';


@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {
  schedule: any;
  preference: any;
  self_id: string;
  goals:any;
  self: any;
  constructor(
    private prefService: PrefService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.schedule= {
      mon: '',
      tues: '',
      wed: '',
      thurs: '',
      fri: '',
      sat: '',
      sun: '',
    }
    this.preference = {
      weight_loss:null, cardio:null, endurance:null, flexibility: null, muscle:null, strength: null, genFit:null, gender:""}

    this.self_id  = localStorage.getItem('id');
    this.getSelf();
  }
  getSelf(){
    this.userService.getSelf(this.self_id).subscribe(data=> {
      this.schedule = data['schedule']
      console.log(data['preference']);
      this.preference = data['preference']
    })
  }

  updateSchedule(){
    this.prefService.updateSchedule({id: this.self_id, schedule:this.schedule})
    .subscribe(data=>{
      this.schedule = data['schedule'];
      this.getSelf();
    })
  }

  updateGoals(){
    console.log("pref data",this.preference);
    this.prefService.updateGoals({id: this.self_id, goals:this.preference})
    .subscribe(data=>{
      console.log('goals data', data);
      this.preference = data['preference'];
      this.getSelf();
    })
  }
}
