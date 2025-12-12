import { Component,  OnInit  } from '@angular/core';
//import { PrescripcionService } from '../service/prescripcion.service';
import { EquiposService } from '../servicios/equipos.service';
import { environment } from 'src/environments/environment';
import { AutheticationService } from '../servicios/authentication-service';

//import { SessionStorageService } from '../_services/session-storage';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})

export class HeaderComponent implements OnInit {
  isUnificado = true;
  user: any = JSON.parse(localStorage.getItem("currentUser"));
  permisos: any;

  hostname: string;
  isEnsenada: boolean = false; /////////////true false;
  IdPerfil = 0;

  constructor(
    private service: EquiposService,
    private auth : AutheticationService
   // private service: PrescripcionService,


   // private session: SessionStorageService  ------------VER!!
  ) { 
    //AME: amensenada
    //this.isEnsenada = this.service.checkIsEnsenada()

    // this.user = JSON.parse(localStorage.getItem('rcmUser')) ? JSON.parse(localStorage.getItem('rcmUser')) : '' ;
    // /////////////////// ver que si es perfil "3" no se muestre el check de gastos ni la columna
    // this.permisos = this.user.Sistemas ? this.user.Sistemas.find(x => x.Id == 1) : window.location.href = './login';
    // this.IdPerfil = this.permisos ? this.permisos.IdPerfil : 0;
   }


  ngOnInit() {
    /*this.user = JSON.parse(localStorage.getItem('rcmUser')) ? JSON.parse(localStorage.getItem('rcmUser')) : '' ;
    this.permisos = this.user.Sistemas.find(x => x.Id == 1);


    this.permisos.IdPerfil = 6;

    console.log(this.permisos);*/
    //this.user = JSON.parse(this.session.getToken()); //this.user = JSON.parse(sessionStorage.getItem('rcmUser')) ? JSON.parse(sessionStorage.getItem('rcmUser')) : '' ;

    // login unificado
    /*this.isUnificado = true;
    this.permisos = this.user.Sistemas.find(x => x.Id == 53);  
    if (!this.permisos) {
      // login aplicacion
      this.isUnificado = false;
    }
    this.permisos = this.user.Sistemas.find(x => x.Id == 54)*/
  }
  CerrarSession(){
    if(environment.production){
      location.href = this.auth.CerrarSession();
    }else{
      localStorage.removeItem("currentUser")
      location.reload()
    }
    
  }
}

