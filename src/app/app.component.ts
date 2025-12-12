import { Component } from '@angular/core';
import { AutheticationService } from './servicios/authentication-service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  usuario = JSON.parse(localStorage.getItem("currentUser"))
   constructor(
    private auth : AutheticationService
   ){
    this.auth.Redireccionar();
   }
  title = 'equipos_front';
  CerrarSession(){
    if(environment.production){
      location.href = this.auth.CerrarSession();
    }else{
      localStorage.removeItem("currentUser")
      location.reload()
    }
    
  }
}
