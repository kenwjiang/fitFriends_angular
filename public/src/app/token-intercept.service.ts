import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptService implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private _auth: AuthService ) { }

    intercept(req, next){
      let authService = this.injector.get(AuthService)
        let tokenizedReq = req.clone({
            setHeaders:{
                Authorization: `Bearer ${authService.getToken()}`
            }
        })
        return next.handle(tokenizedReq)
    }
}
