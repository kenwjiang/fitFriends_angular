import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private _http: HttpClient) { }

  setDefault(data){
    return this._http.post('/setDefaultGym', data)
  }
}
