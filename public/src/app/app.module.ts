import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import { FileSelectDirective } from 'ng2-file-upload';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import { Time24to12Format } from './time24to12.pipe';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppRoutingModule } from './app-routing.module';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { AuthGuard } from './auth.guard';
import { TokenInterceptService } from './token-intercept.service';
import { UserService } from './user.service';
import { HttpService } from './http.service';

import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { PreferenceComponent } from './preference/preference.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgmCoreModule } from '@agm/core';
import { DefaultComponent } from './default/default.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { ChatComponent } from './chat/chat.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { MatTableModule } from '@angular/material/table'
import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatExpansionModule } from '@angular/material/expansion';
import { CropperComponent } from './cropper/cropper.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    MainComponent,
    Time24to12Format,
    PreferenceComponent,
    DefaultComponent,
    EditInfoComponent,
    ChatComponent,
    ChatboxComponent,
    FileSelectDirective,
    CropperComponent
  ],
  entryComponents:[
    CropperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ImageCropperModule,
    HttpModule,
    HttpClientModule,
    NgbModule,
    MatBadgeModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    FlashMessagesModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFileUploadModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSidenavModule,
    AmazingTimePickerModule,
    MatToolbarModule,
    SocketIoModule.forRoot(config),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyCC4s4L_Am_LbC23XXeY59fP5Jh8zcEQIU",
      libraries: ['geometry', 'places']
    })

  ],
  providers: [UserService, HttpService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
