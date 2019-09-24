/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { UserService } from '../user.service';
import { MapService } from '../map.service';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-set-gym',
  templateUrl: './set-gym.component.html',
  styleUrls: ['./set-gym.component.css']
})
export class SetGymComponent implements OnInit {
  private self: any;
  private gym: any;
  private img: any;
  private geoCoder;
  private autocomplete;
  

  @ViewChild('search', {static:false})
  public searchElementRef: ElementRef;


  constructor(    
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private userService: UserService,
    private mapService: MapService,
    private santization: DomSanitizer
    ) { }

  ngOnInit() {
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
          this.autocomplete.get
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          } 
          this.gym = place;
          this.img = this.santization.bypassSecurityTrustStyle(`linear-gradient( rgba(0, 0, 0, 0.80), rgba(0, 0, 0, 0.80) ),url(${this.gym['photos'][0].getUrl()})`)
        });
      });
    });
  }

  getSelf(){
    this.userService.getSelf(localStorage.getItem('id')).subscribe(data=> {
      this.self = data;
    })
  }

  setDefaultGym(id){
    this.mapService.setDefault({id: localStorage.getItem('id'), gym_id: id})
    .subscribe(data=>{
      this.self.default_gym = data['default_gym'];
      this.getSelf();
    })
  }
}
