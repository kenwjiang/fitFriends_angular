/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { PrefService } from '../pref.service';
import { UserService } from '../user.service';
import { MapService } from '../map.service';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl, Validators} from '@angular/forms';

declare const google: any;


@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {
  step = 0;
  private self: any;
  private schedule: any;
  private preference: any;
  private gym: any;
  private img: any;
  private geoCoder;
  private show: boolean;
  private autocomplete;

  selectFormControl: any;

  @ViewChild('search', {static:false})
  public searchElementRef: ElementRef;

  constructor(
    private prefService: PrefService,
    private mapService: MapService,
    private userService: UserService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private santization: DomSanitizer
  ) { }

  ngOnInit() {
    this.show = false;
    this.self = {
      default_gym: '',
      _id: ''
    };
    this.schedule= {
      mon: '',
      tues: '',
      wed: '',
      thurs: '',
      fri: '',
      sat: '',
      sun: '',
    };
    this.gym = {
      name: '',
      url: '',
      formatted_address: '',
      formatted_phone_number: '',
      place_id: ''
    }
    this.preference = {
      user_id: localStorage.getItem('id'), weight_loss:false, cardio:false, endurance:false, flexibility: false, muscle:false, strength: false, genFit:false, gender:""
    };

    this.getSelf();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      
      // this.GymSearch
      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["establishment"]
      });
      this.autocomplete.addListener("place_changed", () => {
        
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
          // this.autocomplete.get
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          } 
          this.gym = place;
          this.show = true;
          this.img = this.santization.bypassSecurityTrustStyle(`linear-gradient( rgba(0, 0, 0, 0.80), rgba(0, 0, 0, 0.80) ),url(${this.gym['photos'][0].getUrl()})`)
        });
      });
    });
  }

  getSelf(){
    this.userService.getSelf(localStorage.getItem('id')).subscribe(data=> {
      this.self = data;
      if(data['schedule']){
        this.schedule = data['schedule'];
      }
      if(data['preference']){
        this.preference = data['preference'];
      }
      this.selectFormControl =  new FormControl(this.preference['gender'], Validators.required);
    })
  }

  updateSchedule(){
    this.prefService.updateSchedule({id: localStorage.getItem('id'), schedule:this.schedule})
    .subscribe(data=>{
      this.getSelf();
    })
  }

  updateGoals(){
    console.log('preference', this.preference);
    this.prefService.updateGoals({id: localStorage.getItem('id'), goals:this.preference})
    .subscribe(data=>{
      this.getSelf();
    })
  }
  setDefaultGym(id){
    localStorage.setItem('gym', id);
    console.log(localStorage.getItem('gym'));
    this.mapService.setDefault({id: localStorage.getItem('id'), gym_id: id})
    .subscribe(data=>{
      this.self.default_gym = data['default_gym'];
      this.getSelf();
    })
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
