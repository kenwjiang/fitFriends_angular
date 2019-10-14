import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { FlashMessagesService } from 'ngx-flash-messages';
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
  old_pw: any;
  new_pw: any;
  pw_confirm:any;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  step = 0;

  matcher = new MyErrorStateMatcher();
  
  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private flashMessagesService: FlashMessagesService
    ) { }

  ngOnInit() {
    this.self = {fname:'', lname:"", email: ''};
    this.old_pw = "";
    this.new_pw = '';
    this.pw_confirm = "";
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
      this.flashMessagesService.show('Update Successful!', {
        classes: ['alert-success'],
        timeout: 1000
      })
      this.getSelf();
    })
  }
  changePassword(){
    if(this.new_pw != this.pw_confirm) {
      this.flashMessagesService.show('Passwords do not match!', {
        classes: ['alert-danger'],
        timeout: 1000
      })
    } else {
      this.userService.updatePassword({id: this.self._id, old: this.old_pw, new:this.new_pw}).subscribe(data=> {
        if(data['error']){
          this.flashMessagesService.show('Error updating password!', {
            classes: ['alert-danger'],
            timeout: 1000
          })
        } else {
          this.flashMessagesService.show('Password updated successfully.', {
            classes: ['alert-success'],
            timeout: 1000
          })
        }
      })
    }
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