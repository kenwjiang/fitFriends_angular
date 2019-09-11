import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrefService {

  constructor(private http: HttpClient) { }

  updateGoals(data){
    return this.http.post('/updateGoals', data);
  }
  updateSchedule(data){
    return this.http.post('/updateSchedule', data);
  }
}
