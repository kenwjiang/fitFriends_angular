/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { MapService } from '../map.service';
import { UserService } from '../user.service';
import { Router} from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  self_id:string;
  self:any;
  private geoCoder;
  private autocomplete;

  @ViewChild('search', {static:false})
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private mapService: MapService,
    private userService: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.self_id = localStorage.getItem('id');
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

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            console.log('place', place);           
          });
        });
      });
    }

    // Get Current Location Coordinates


    setDefaultGym(id){
      this.mapService.setDefault({id: this.self_id, gym_id: id})
      .subscribe(data=>{
        this.self.default_gym = data['default_gym'];
        this._router.navigate(['/main', 'default'])
      })
    }

    getSelf(){
      this.userService.getSelf(this.self_id)
      .subscribe(data=> {
        this.self = data;
      })
    }




  }
