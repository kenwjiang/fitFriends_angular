import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { PreferenceComponent } from './preference/preference.component';
import { DefaultComponent } from './default/default.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { ChatComponent } from './chat/chat.component';
import { ChatboxComponent } from './chatbox/chatbox.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'about', component: AboutComponent},
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "main", component: MainComponent, canActivate:[AuthGuard], children: [
    { path: 'preferences', component: PreferenceComponent},
    { path: 'default', component: DefaultComponent },
    { path: "edit_info", component: EditInfoComponent},
    { path: 'chat', component: ChatComponent, children: [
      {path: ':room_id', component: ChatboxComponent}
    ]}
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
