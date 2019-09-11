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
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  map: any;
  nearbyGyms: any=[];
  private geoCoder;
  private gymSearch;

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
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;

        // this.GymSearch
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["establishment"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.getNearbyGyms(this.latitude, this.longitude);
            this.zoom = 14;
          });
        });
      });
    }

    // Get Current Location Coordinates
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 14;
          this.getNearbyGyms(this.latitude, this.longitude)
        });
      }
    }


    markerDragEnd($event: MouseEvent) {
      this.latitude = $event.coords.lat;
      this.longitude = $event.coords.lng;
      this.getNearbyGyms(this.latitude, this.longitude);
    }

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

    setMapData(event){
      this.map = event;
      this.gymSearch = new google.maps.places.PlacesService(this.map);
    }

    getNearbyGyms(lat, lng){
      this.gymSearch.nearbySearch({keyword:"gym", location:{lat:lat, lng: lng}, radius: 3000}, (results, status) => {
        console.log(results);
        let gymsArray = [];
        for (let gym of results){
          let latitude = gym.geometry.location.lat();
          let longitude = gym.geometry.location.lng();
          gymsArray.push({name:gym.name, address: gym.vicinity, lat: latitude, lng: longitude, place_id:gym.place_id})
        }
        this.nearbyGyms = gymsArray;
      })

    }


  }
