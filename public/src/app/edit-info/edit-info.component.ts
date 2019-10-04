import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'

import {MatDialog} from '@angular/material/dialog';
import  {CropperComponent} from '../cropper/cropper.component';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {
  self: any;
  password: any;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  step = 0;

  matcher = new MyErrorStateMatcher();
  
  constructor(
    private userService: UserService,
    public dialog: MatDialog
    ) { }

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
  openDialog(): void {
    const dialogRef = this.dialog.open(CropperComponent, {
      width: '75%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(result=> {
      this.setAvatar(localStorage.getItem('id'), result);
    })
  }
  changeInfo(){
    this.userService.updateInfo(this.self)
    .subscribe(data => {
      this.getSelf();
    })
  }
  changePassword(){
    this.userService.updatePassword({id: this.self._id, old: this.password.old, new:this.password.new})
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

  private setAvatar(id, image){
    if(image){
      this.userService.setAvatar({id: id, imgString: image}).subscribe(data=>{
        this.self = data;
      })
    }
  }
}