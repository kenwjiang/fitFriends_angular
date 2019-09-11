import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {
  self: any;
  password: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.self = {fname:'', lname:"", email: ''};
    this.password= {old: '', new: ''};
    this.getSelf();
  }
  getSelf(){
    this.userService.getSelf(localStorage.getItem('id'))
    .subscribe(data=> {
      this.self = data;
    })
  }
  changeInfo(){
    this.userService.updateInfo(this.self)
    .subscribe(data => {
      console.log(data);
      this.getSelf();
    })
  }
  changePassword(){
    this.userService.updatePassword({id: this.self._id, old: this.password.old, new:this.password.new})
    .subscribe(data=>{
      console.log(data);
    })
  }
}
