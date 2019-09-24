import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { PreferenceComponent } from './preference/preference.component';
import { MapComponent } from './map/map.component';
import { DefaultComponent } from './default/default.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { ChatComponent } from './chat/chat.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { SetScheduleComponent } from './set-schedule/set-schedule.component';
import { SetGymComponent } from './set-gym/set-gym.component';
import { SetGoalsComponent } from './set-goals/set-goals.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'about', component: AboutComponent},
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "main", component: MainComponent, canActivate:[AuthGuard], children: [
    { path: 'preferences', component: PreferenceComponent, children: [
      {path: 'gym', component: SetGymComponent},
      {path: 'schedule', component: SetScheduleComponent},
      {path: 'goals', component: SetGoalsComponent}
    ]},
    { path: 'map', component: MapComponent },
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
