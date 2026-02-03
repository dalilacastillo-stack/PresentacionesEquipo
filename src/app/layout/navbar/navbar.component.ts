import { Component, OnInit } from "@angular/core";
import { AutheticationService } from "src/app/servicios/authentication-service";
import { environment } from "src/environments/environment";
@Component({
    selector    :'app-navbar',
    templateUrl : 'navbar.component.html',
    styleUrls   : ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    produccion = environment.production;
    usuario    = JSON.parse(localStorage.getItem("currentUser"));
    constructor(
        private authentication : AutheticationService
    ){}

    ngOnInit() : void {console.log(this.produccion) }

    CambiarPerfil(perfil : string){
        this.authentication.CambiarPefil(perfil);       
    }

    CerrarSesion(){
        this.authentication.CerrarSesion(); 
    }
}