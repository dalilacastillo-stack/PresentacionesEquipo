import { Component } from '@angular/core';
import { AutheticationService } from '../servicios/authentication-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  

  constructor(private auth : AutheticationService){}


  CerrarSession(){
    location.href = this.auth.CerrarSession();
  }
}
