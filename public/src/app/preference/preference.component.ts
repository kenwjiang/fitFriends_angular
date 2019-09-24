/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { PrefService } from '../pref.service';
import { UserService } from '../user.service';

declare const google: any;

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
  


  @ViewChild('search', {static:false})
  public searchElementRef: ElementRef;

  constructor(
    private prefService: PrefService,
    private userService: UserService,
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
      this.preference = data['preference']
    })
  }

  updateSchedule(){
    this.prefService.updateSchedule({id: this.self_id, schedule:this.schedule})
    .subscribe(data=>{
      this.getSelf();
    })
  }

  updateGoals(){
    this.prefService.updateGoals({id: this.self_id, goals:this.preference})
    .subscribe(data=>{
      this.preference = data['preference'];
      this.getSelf();
    })
  }
}
