import { Component } from '@angular/core';
import { AutheticationService } from './servicios/authentication-service';
import { environment } from 'src/environments/environment';

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
    this.auth.Validar();
   }
  title = 'equipos_front';
  CerrarSession(){
    if(environment.production){
      this.auth.CerrarSesion();
    }else{
      localStorage.removeItem("currentUser")
      location.reload()
    }
    
  }
}
